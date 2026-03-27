import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can submit answers" },
        { status: 403 },
      );
    }

    const { questionId, answerText } = await request.json();
    if (!questionId || !answerText?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { classId: true },
    });
    if (!question)
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        classId_studentId: {
          classId: question.classId,
          studentId: session.user.id,
        },
      },
    });
    if (!enrollment) {
      return NextResponse.json(
        { error: "You are not enrolled in this class" },
        { status: 403 },
      );
    }

    const existing = await prisma.answer.findUnique({
      where: {
        studentId_questionId: { studentId: session.user.id, questionId },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already answered this question" },
        { status: 409 },
      );
    }

    const answer = await prisma.answer.create({
      data: {
        studentId: session.user.id,
        questionId,
        answerText: answerText.trim(),
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error("[ANSWER_SUBMIT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
