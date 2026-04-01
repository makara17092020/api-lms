import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// 1. Initialize AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

export async function POST(req: Request) {
  const auth = await getAuth();

  if (!auth || auth.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Forbidden. Student access only." },
      { status: 403 },
    );
  }

  try {
    const { topic, level, availableTimePerDay } = await req.json();

    if (!topic || !level) {
      return NextResponse.json(
        { error: "Topic and level are required" },
        { status: 400 },
      );
    }

    // 2. Check for Duplicate to Save Quota
    const existingPlan = await prisma.studyPlan.findFirst({
      where: { studentId: auth.id, topic: topic.trim() },
    });

    if (existingPlan) {
      return NextResponse.json(
        { error: `Plan already exists for '${topic}'` },
        { status: 409 },
      );
    }

    // 3. Gather Context
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: auth.id },
      include: { class: true },
    });
    const classContext = enrollments.map((e) => e.class.className).join(", ");

    // 4. Configure Model (Gemini 2.5 Flash is the 2026 Stable Workhorse)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json", // Forces JSON output
      },
    });

    const prompt = `
      You are an elite academic AI planner. 
      Topic: "${topic}". Level: "${level}". Daily Time: ${availableTimePerDay} hours.
      Student's Classes: [${classContext}].

      Generate a study plan (7-14 days). 
      Format the response as a valid JSON object.
      
      JSON Schema:
      {
        "duration": number,
        "tasks": [
          { "dayNumber": number, "subTasks": ["string", "string", "string"] }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Robust JSON Parsing (Bracket-Seek Logic)
    let aiOutput;
    try {
      const firstBracket = text.indexOf("{");
      const lastBracket = text.lastIndexOf("}");

      if (firstBracket === -1 || lastBracket === -1) {
        throw new Error("Invalid format");
      }

      const cleanJson = text.substring(firstBracket, lastBracket + 1);
      aiOutput = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("AI Output Parsing Failed. Raw Text:", text);
      throw new Error("AI returned invalid JSON format.");
    }

    // 6. Database Transaction
    const savedPlan = await prisma.$transaction(async (tx) => {
      const plan = await tx.studyPlan.create({
        data: {
          studentId: auth.id,
          topic: topic.trim(),
          duration: aiOutput.duration || 7,
        },
      });

      await tx.task.createMany({
        data: aiOutput.tasks.map((t: any) => ({
          studyPlanId: plan.id,
          dayNumber: t.dayNumber,
          taskDescription: t.subTasks.map((s: string) => `• ${s}`).join("\n"),
          isCompleted: false,
        })),
      });

      return tx.studyPlan.findUnique({
        where: { id: plan.id },
        include: { tasks: { orderBy: { dayNumber: "asc" } } },
      });
    });

    return NextResponse.json(savedPlan, { status: 201 });
  } catch (error: any) {
    console.error("[GEMINI_STUDY_PLANNER_ERROR]:", error);

    // Handle Quota/Rate Limits (429)
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Daily AI request limit reached. Please try again tomorrow." },
        { status: 429 },
      );
    }

    // Handle Service Unavailable (503)
    if (error.status === 503) {
      return NextResponse.json(
        { error: "AI servers are busy. Please try again in a few minutes." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
