import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const ai = new GoogleGenAI({});

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
      console.error(
        "[AUTH_ERROR]: ACCESS_TOKEN_SECRET is missing in environment variables.",
      );
      return null;
    }

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

    // 1. Check for Duplicate StudyPlan for this student
    const existingPlan = await prisma.studyPlan.findFirst({
      where: { studentId: auth.id, topic: topic.trim() },
    });

    if (existingPlan) {
      return NextResponse.json(
        { error: `You already have a study plan spawned for '${topic}'` },
        { status: 409 },
      );
    }

    // 2. Grab actual enrolled classes to context-bias Gemini's curation
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: auth.id },
      include: { class: true },
    });
    const classContext = enrollments.map((e) => e.class.className).join(", ");

    // 3. Prompt Engineering + Gemini JSON Schema Schema
    const prompt = `
      You are an elite academic AI planner.
      Generate a study plan for a student who is at a "${level}" level.
      Target Topic: "${topic}".
      Student's Available Time per Day: ${availableTimePerDay} hours.
      The student is also concurrently enrolled in the following classes: [${classContext}]. Connect the study plan loosely to these contexts if applicable.

      Break down the tasks into daily intervals. For EACH day, generate exactly 3 highly focused action items (bullet points) that fit the student's available time. 
      Action items should start with active verbs (e.g., "Review...", "Understand...", "Create...").
      Generate exactly 7 to 14 days of sequential tasks.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            duration: {
              type: Type.INTEGER,
              description: "Total duration of the study plan in days.",
            },
            tasks: {
              type: Type.ARRAY,
              description:
                "Sequential list of daily tasks to achieve the goal.",
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  subTasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description:
                      "3 highly actionable bullet items for this specific day.",
                  },
                },
                required: ["dayNumber", "subTasks"],
              },
            },
          },
          required: ["duration", "tasks"],
        },
      },
    });

    const aiOutput = JSON.parse(response.text || "{}");

    // 4. Prisma Transaction: Combine subTasks into standard String using line-breaks
    const savedPlan = await prisma.$transaction(async (tx) => {
      const plan = await tx.studyPlan.create({
        data: {
          studentId: auth.id,
          topic: topic.trim(),
          duration: aiOutput.duration || 14,
        },
      });

      await tx.task.createMany({
        data: aiOutput.tasks.map((t: any) => ({
          studyPlanId: plan.id,
          dayNumber: t.dayNumber,
          // 💡 Combining bullet points into a multi-line standard string using `\n`!
          taskDescription: Array.isArray(t.subTasks)
            ? t.subTasks.map((bullet: string) => `• ${bullet}`).join("\n")
            : "No agenda defined for this day.",
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
    return NextResponse.json(
      { error: "Failed to generate AI Study Plan" },
      { status: 500 },
    );
  }
}
