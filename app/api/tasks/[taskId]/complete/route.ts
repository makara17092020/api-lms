import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const session = await getServerSession();

    // ✅ FIX: Safe Optional Chaining (Prevents 'session.user is null' TS Error)
    const studentId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!session || !studentId || userRole !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const { answer } = await request.json();

    if (!answer || answer.trim() === "") {
      return NextResponse.json(
        { error: "Answer text is required" },
        { status: 400 },
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // 💾 Updates the Answer directly inside Task model (Per your Prisma schema!)
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        isCompleted: true,
        studentAnswer: answer.trim(),
        completedAt: new Date(),
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
