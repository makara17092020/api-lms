import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// --- GET: Fetch questions based on role ---
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

    // 1. Fetch user role to determine what data they can see
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Permission Check
    if (user.role === "TEACHER") {
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        select: { teacherId: true },
      });
      if (!classData || classData.teacherId !== session.user.id) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } else if (user.role === "STUDENT") {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          classId_studentId: { classId, studentId: session.user.id },
        },
      });
      if (!enrollment) {
        return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
      }
    }

    // 3. Fetch Questions with Conditional Answers
    // Teachers get ALL answers + Student info
    // Students only get their OWN answer ID (to check if they've finished)
    const questions = await prisma.question.findMany({
      where: { classId },
      include: {
        answers: user.role === "TEACHER" 
          ? {
              include: { 
                student: { 
                  select: { name: true, email: true } 
                } 
              }
            } 
          : {
              where: { studentId: session.user.id },
              select: { id: true }
            },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("[QUESTIONS_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- POST: Create a new question ---
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, classId, type, options } = await request.json();
    
    if (!title || !description || !classId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: { teacher: true }
    });

    if (!classData || classData.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const question = await prisma.question.create({
      data: {
        title,
        description,
        classId,
        type: type || "TEXT",
        options: type === "MULTIPLE_CHOICE" ? options : [],
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("[QUESTION_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- PUT: Update an existing question ---
export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, title, description, type, options } = body;

    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!existingQuestion || existingQuestion.class.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        title,
        description,
        type: type || "TEXT",
        options: type === "MULTIPLE_CHOICE" ? (options || []) : [],
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("[PUT_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- DELETE: Remove a question ---
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const question = await prisma.question.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!question || question.class.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("[DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}