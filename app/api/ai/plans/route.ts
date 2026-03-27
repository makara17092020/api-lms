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

export async function GET() {
  const auth = await getAuth();

  // 🔓 1. Allow both Students AND Super Admins
  if (!auth || (auth.role !== "STUDENT" && auth.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 🔍 2. If it's a student, filter by their ID. If it's an admin, find all plans!
    const whereCondition =
      auth.role === "STUDENT" ? { studentId: auth.id } : {};

    const plans = await prisma.studyPlan.findMany({
      where: whereCondition,
      include: {
        tasks: {
          orderBy: { dayNumber: "asc" },
        },
        // If you want to see who made it on the admin panel:
        student: {
          select: { name: true, email: true },
        },
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
