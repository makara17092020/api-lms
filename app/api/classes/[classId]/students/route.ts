import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ClassService } from "@/app/services/class.servide";

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    // Standardizing to your .env variable
    const secretKey = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    const secret = new TextEncoder().encode(secretKey!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch (err) {
    console.error("JWT Verification failed:", err);
    return null;
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params; // Required for Next.js 15
  const auth = await getAuth();

  if (!auth || (auth.role !== "SUPER_ADMIN" && auth.role !== "TEACHER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    const enrollment = await ClassService.enrollStudent(classId, studentId);

    return NextResponse.json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error: any) {
    // Handle Prisma unique constraint (student already enrolled)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Student is already in this class" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Enrollment failed" },
      { status: 500 },
    );
  }
}
