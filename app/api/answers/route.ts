import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user?.role !== "TEACHER") {
      return NextResponse.json({ error: "Only teachers can view answers" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json({ error: "questionId required" }, { status: 400 });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { classId: true },
    });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const classData = await prisma.class.findUnique({
      where: { id: question.classId },
      select: { teacherId: true },
    });
    if (!classData || classData.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: { student: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(answers);
  } catch (error) {
    console.error("[ANSWERS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

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
