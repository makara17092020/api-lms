import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const ai = new GoogleGenerativeAI("{}");

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) return null;
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

    // Use Gemini 2.5 Flash with JSON enforcement
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are an expert teacher creating a final assessment quiz.
      Study Plan Content: ${planContent}

      Generate exactly 5 high-quality multiple-choice questions.
      Each question must have exactly 4 options.
      
      Return ONLY a JSON object:
      {
        "questions": [
          {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "answer": "string"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Robust JSON Extraction
    let aiOutput;
    try {
      const firstBracket = text.indexOf("{");
      const lastBracket = text.lastIndexOf("}");
      aiOutput = JSON.parse(text.substring(firstBracket, lastBracket + 1));
    } catch (e) {
      throw new Error("AI returned invalid JSON formatting.");
    }

    const questions = aiOutput.questions || [];

    const quiz = await prisma.$transaction(async (tx) => {
      const createdQuiz = await tx.quiz.create({
        data: {
          studyPlanId: planId,
          studentId: auth.id,
          title: `Quiz: ${planContent.substring(0, 30)}...`,
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
