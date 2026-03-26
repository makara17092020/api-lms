import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ planId: string }> }, // ✅ Type it as a Promise
) {
  const auth = await getAuth();
  if (!auth || auth.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 🔥 Fix: Await params BEFORE destructing it!
    const resolvedParams = await params;
    const planId = resolvedParams.planId;

    // 1. Verify ownership (ensure this plan belongs to the logged-in student)
    const plan = await prisma.studyPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (plan.studentId !== auth.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this plan" },
        { status: 403 },
      );
    }

    // 2. Clear relations and delete atomically
    await prisma.$transaction([
      prisma.task.deleteMany({ where: { studyPlanId: planId } }),
      prisma.studyPlan.delete({ where: { id: planId } }),
    ]);

    return NextResponse.json({ message: "Study plan deleted successfully" });
  } catch (error) {
    console.error("[DELETE_PLAN_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to delete study plan" },
      { status: 500 },
    );
  }
}
