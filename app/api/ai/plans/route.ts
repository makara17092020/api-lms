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
  if (!auth || auth.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plans = await prisma.studyPlan.findMany({
      where: { studentId: auth.id },
      include: {
        tasks: {
          orderBy: { dayNumber: "asc" },
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
