import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuth();
  const { id: studentId } = await params;

  if (!auth || (auth.role !== "TEACHER" && auth.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: { class: true },
        },
        studyPlans: {
          include: {
            tasks: {
              orderBy: { dayNumber: "asc" },
            },
          },
        },
      },
    });

    if (!student)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });

    return NextResponse.json(student);
  } catch (error) {
    console.error("DEBUG_PROFILE_API_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
