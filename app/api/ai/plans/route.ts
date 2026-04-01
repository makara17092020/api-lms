// app/api/ai/plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export async function GET(request: NextRequest) {
  const auth = await getAuth();
  if (!auth || (auth.role !== "STUDENT" && auth.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  const whereCondition: any =
    auth.role === "STUDENT" ? { studentId: auth.id } : {};
  if (classId) whereCondition.classId = classId;

  try {
    const plans = await prisma.studyPlan.findMany({
      where: whereCondition,
      include: {
        tasks: {
          orderBy: { dayNumber: "asc" },
          select: {
            id: true,
            taskDescription: true,
            isCompleted: true,
          },
        },
        class: { select: { className: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("[GET_PLANS_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}
