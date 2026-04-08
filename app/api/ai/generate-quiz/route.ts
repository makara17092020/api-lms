import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// 1. Initialize AI with the key from .env
const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Helper to verify JWT from cookies in Next.js Edge-compatible way
 */
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
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

export async function POST(req: Request) {
  // 1. Check Authentication
  const auth = await getAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Role Protection (adjust logic if Admins should also be able to generate)
  if (auth.role !== "STUDENT" && auth.role !== "SUPER_ADMIN") {
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

    // Use the 2026 stable model: gemini-2.5-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are an expert teacher creating a final assessment quiz.
      Study Plan Content: ${planContent}

      Generate exactly 5 high-quality multiple-choice questions based on the content above.
      Each question must have exactly 4 options.
      
      Return ONLY a JSON object with this structure:
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

    // 3. Generate Content
    const result = await model.generateContent(prompt);

    // FIX: result.response is a property, not a promise. No 'await' needed.
    const response = result.response;
    const text = response.text();

    // 4. Parse AI Output
    let questions;
    try {
      const aiOutput = JSON.parse(text);
      questions = aiOutput.questions;
    } catch (e) {
      // Fallback for cases where AI includes markdown blocks
      const cleanJson = text.replace(/```json|```/g, "").trim();
      questions = JSON.parse(cleanJson).questions;
    }

    if (!questions || !Array.isArray(questions)) {
      throw new Error("AI failed to generate a valid questions array.");
    }

    // 5. Save to Database via Transaction
    const quiz = await prisma.$transaction(async (tx) => {
      const createdQuiz = await tx.quiz.create({
        data: {
          studyPlanId: planId,
          studentId: auth.id,
          title: `Quiz: ${planContent.substring(0, 40)}...`,
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

    // Specific error handling for API/Model issues
    if (error.status === 404) {
      return NextResponse.json(
        {
          error:
            "AI Model not found. Try 'gemini-1.5-flash-latest' or 'gemini-pro'.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 },
    );
  }
}
