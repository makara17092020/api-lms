import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// Helper to match your existing auth pattern
async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const auth = await getAuth();

    if (!auth || auth.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Next.js 15: Must await params
    const { taskId } = await params;
    const { answer } = await request.json();

    if (!answer || answer.trim() === "") {
      return NextResponse.json(
        { error: "Answer text is required" },
        { status: 400 },
      );
    }

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Update the task with the answer and completion status
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
    console.error("❌ BACKEND ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update database" },
      { status: 500 },
    );
  }
}
