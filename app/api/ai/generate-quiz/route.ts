// app/api/ai/generate-quiz/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const ai = new GoogleGenAI({});

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) {
      console.error("[AUTH_ERROR]: ACCESS_TOKEN_SECRET is missing");
      return null;
    }

    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth || auth.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Forbidden. Student access only." },
      { status: 403 },
    );
  }

  try {
    const { planContent, planId } = await req.json();

    if (!planContent || !planId) {
      return NextResponse.json(
        { error: "planContent and planId are required" },
        { status: 400 },
      );
    }

    // Stronger prompt for Gemini (same style as your generate-plan)
    const prompt = `
You are an expert teacher creating a final assessment quiz.
Study Plan Content:
${planContent}

Generate **exactly 5** high-quality multiple-choice questions that test deep understanding of the material.
Each question must have **exactly 4** options.
Make questions clear, non-trivial, and directly related to the study plan.

Return ONLY valid JSON in this exact structure:
{
  "questions": [
    {
      "question": "Full question text here?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "answer": "The exact text of the correct option"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "Exactly 5 multiple-choice questions",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  answer: { type: Type.STRING },
                },
                required: ["question", "options", "answer"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const aiOutput = JSON.parse(response.text || "{}");
    const questions = aiOutput.questions || [];

    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error("AI did not return exactly 5 questions");
    }

    // Save quiz + questions in a transaction
    const quiz = await prisma.$transaction(async (tx) => {
      const createdQuiz = await tx.quiz.create({
        data: {
          studyPlanId: planId,
          studentId: auth.id,
          title: `Quiz on ${planContent.substring(0, 50)}...`,
        },
      });

      await tx.quizQuestion.createMany({
        data: questions.map((q: any, index: number) => ({
          quizId: createdQuiz.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.answer,
          order: index,
        })),
      });

      return createdQuiz;
    });

    return NextResponse.json({ quizId: quiz.id }, { status: 201 });
  } catch (error: any) {
    console.error("[GENERATE_QUIZ_ERROR]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 },
    );
  }
}
