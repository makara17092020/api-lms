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
    if (user?.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Only teachers can create questions" },
        { status: 403 },
      );
    }

    const { title, description, classId } = await request.json();
    if (!title || !description || !classId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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

    const question = await prisma.question.create({
      data: { title, description, classId },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("[QUESTION_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
