import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { classId } = await params;

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      select: { className: true, teacherId: true },
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isStudent = user?.role === "STUDENT";
    const isTeacher = user?.role === "TEACHER";

    const isEnrolled = isStudent
      ? !!(await prisma.enrollment.findUnique({
          where: { classId_studentId: { classId, studentId: session.user.id } },
        }))
      : false;

    const isClassTeacher = isTeacher && classData.teacherId === session.user.id;

    if (!isEnrolled && !isClassTeacher) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const questions = await prisma.question.findMany({
      where: { classId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, description: true, createdAt: true },
    });

    let questionsWithStatus = questions;

    if (isStudent && isEnrolled) {
      const answered = await prisma.answer.findMany({
        where: {
          studentId: session.user.id,
          questionId: { in: questions.map((q) => q.id) },
        },
        select: { questionId: true },
      });
      const answeredSet = new Set(answered.map((a) => a.questionId));

      questionsWithStatus = questions.map((q) => ({
        ...q,
        isAnswered: answeredSet.has(q.id),
      }));
    }

    return NextResponse.json({
      className: classData.className,
      questions: questionsWithStatus,
    });
  } catch (error) {
    console.error("[QUESTIONS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
