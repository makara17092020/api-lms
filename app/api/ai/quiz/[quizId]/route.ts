import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }, // Next.js 15 Async Params
) {
  try {
    // 1. Unwrapping the params promise (Required in Next.js 15)
    const { quizId } = await params;

    // 2. Fetching the Quiz and its related QuizQuestions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: "asc" }, // Matches the 'order' field in your QuizQuestion model
        },
      },
    });

    // 3. Handle 404
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // 4. Return the formatted data to match your frontend interface
    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    });
  } catch (error) {
    console.error("[QUIZ_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
