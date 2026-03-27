import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this to where your Prisma Client is!

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }, // In Next 15+ params is a Promise
) {
  try {
    const { taskId } = await params;
    const { answer } = await request.json();

    if (!answer || answer.trim() === "") {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 },
      );
    }

    // Push to PostgreSQL / SQLite
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        isCompleted: true,
        studentAnswer: answer, // Prisma checks this property!
      },
    });

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error("❌ BACKEND ERROR ON TASK COMPLETION:", error);
    return NextResponse.json(
      { error: "Failed to update database" },
      { status: 500 },
    );
  }
}
