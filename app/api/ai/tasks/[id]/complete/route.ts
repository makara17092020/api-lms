import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const ai = new GoogleGenerativeAI({});

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) return null;

    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  const auth = await getAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;
  const { answer } = await req.json();

  try {
    // 1. Get the task
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // 2. Ask Gemini to evaluate if the answer is good enough
    const prompt = `
      Evaluate if the user understands the daily concept.
      Task Goal: "${task.taskDescription}"
      User's Explanation: "${answer}"

      If the answer is relevant and accurate to the task description, pass them. If it's gibberish or unrelated, fail them.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
          },
          required: ["passed", "feedback"],
        },
      },
    });

    const grading = JSON.parse(response.text || "{}");

    if (!grading.passed) {
      return NextResponse.json(
        {
          success: false,
          message:
            grading.feedback ||
            "Your answer did not satisfy the task criteria. Please try explaining it again.",
        },
        { status: 400 },
      );
    }

    // 3. Mark it as completed if passed
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isCompleted: true },
    });

    return NextResponse.json({
      success: true,
      message: "Task completed!",
      task: updatedTask,
    });
  } catch (error) {
    console.error("[TASK_COMPLETE_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to evaluate task answer" },
      { status: 500 },
    );
  }
}
