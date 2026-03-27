import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  // 1. Type params as a Promise
  { params }: { params: Promise<{ classId: string }> },
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "STUDENT") {
      return NextResponse.json({ error: "Only students" }, { status: 403 });
    }

    // 2. Await the params before using them
    const { classId } = await params;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_studentId: {
          classId,
          studentId: session.user.id,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    // 3. Run counts in parallel (faster!)
    const [totalQuestions, answeredQuestions] = await Promise.all([
      prisma.question.count({ where: { classId } }),
      prisma.answer.count({
        where: {
          studentId: session.user.id,
          question: { classId },
        },
      }),
    ]);

    const progressPercentage =
      totalQuestions === 0
        ? 0
        : Math.round((answeredQuestions / totalQuestions) * 100);

    return NextResponse.json({
      totalQuestions,
      answeredQuestions,
      progressPercentage,
    });
  } catch (error) {
    console.error("[PROGRESS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
