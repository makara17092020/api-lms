import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const ai = new GoogleGenerativeAI('{}');

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
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { answer } = await req.json();

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Evaluate if this explanation satisfies the task goal.
      Goal: "${task.taskDescription}"
      User Answer: "${answer}"

      Return JSON:
      { "passed": boolean, "feedback": "string" }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Robust Extraction
    const firstBracket = text.indexOf("{");
    const lastBracket = text.lastIndexOf("}");
    const grading = JSON.parse(text.substring(firstBracket, lastBracket + 1));

    if (!grading.passed) {
      return NextResponse.json(
        {
          success: false,
          message: grading.feedback || "Explanation insufficient.",
        },
        { status: 400 },
      );
    }

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
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
