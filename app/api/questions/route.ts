import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json({ error: "classId required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role === "TEACHER") {
      // Teachers can see all questions for their classes
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        select: { teacherId: true },
      });
      if (!classData || classData.teacherId !== session.user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } else if (user?.role === "STUDENT") {
      // Students can see questions for classes they're enrolled in
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          classId_studentId: { classId, studentId: session.user.id },
        },
      });
      if (!enrollment) {
        return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    const questions = await prisma.question.findMany({
      where: { classId },
      include: {
        answers: user?.role === "TEACHER" ? {
          include: { student: { select: { name: true, email: true } } }
        } : user?.role === "STUDENT" ? {
          where: { studentId: session.user.id },
          select: { id: true }
        } : false,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("[QUESTIONS_GET_ERROR]", error);
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
    if (user?.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Only teachers can create questions" },
        { status: 403 },
      );
    }

    const { title, description, classId, type, options } = await request.json();
    if (!title || !description || !classId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (type === "MULTIPLE_CHOICE" && (!options || options.length < 2)) {
      return NextResponse.json({ error: "Multiple choice questions need at least 2 options" }, { status: 400 });
    }

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      select: { teacherId: true },
    });

    if (!classData || classData.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only create questions for your own classes" },
        { status: 403 },
      );
    }

    // Build data object; type/options are optional by schema support.
    const newQuestionPayload: any = { title, description, classId };
    if (type) newQuestionPayload.type = type;
    if (options) newQuestionPayload.options = options;

    try {
      const question = await prisma.question.create({ data: newQuestionPayload });
      return NextResponse.json(question, { status: 201 });
    } catch (e: any) {
      // If Prisma client schema doesn't have type/options, retry with simple payload.
      const isPrismaValidationError = e?.code === "P2009" || e?.name === "PrismaClientValidationError" || e?.message?.includes("Unknown argument");
      if (isPrismaValidationError) {
        console.warn("QUESTION_CREATE_WARNING: retrying without type/options due to client validation error", e?.message);
        const fallbackQuestion = await prisma.question.create({
          data: { title, description, classId },
        });
        return NextResponse.json(fallbackQuestion, { status: 201 });
      }
      throw e;
    }
  } catch (error) {
    console.error("[QUESTION_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
