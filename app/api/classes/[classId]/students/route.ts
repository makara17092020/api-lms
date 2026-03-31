import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
// Check spelling: Ensure it's .service and not .servide
import { ClassService } from "@/app/services/class.servide";

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    // Standardizing to your .env variable for security
    const secretKey = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    if (!secretKey) {
      console.error("Missing JWT Secret in Environment Variables");
      return null;
    }
    const secret = new TextEncoder().encode(secretKey);
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
  // 1. Unwrapping params for Next.js 15/16 compatibility
  const { classId } = await params;
  const auth = await getAuth();

  // 2. Authorization Check (Allow both Super Admins and Teachers)
  if (!auth || (auth.role !== "SUPER_ADMIN" && auth.role !== "TEACHER")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "Student selection required" },
        { status: 400 },
      );
    }

    // 3. Database Operation via Service
    const enrollment = await ClassService.enrollStudent(classId, studentId);

    return NextResponse.json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error: any) {
    // 4. Handle Prisma Unique Constraint (P2002: Student already enrolled)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This student is already enrolled in this class." },
        { status: 409 },
      );
    }

    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: error.message || "Server error during enrollment" },
      { status: 500 },
    );
  }
}
