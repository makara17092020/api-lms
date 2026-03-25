import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ClassService } from "@/app/services/class.servide"; // Ensure correct spelling: .service vs .servid

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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params; // Required for Next.js 15
  const auth = await getAuth();

  if (!auth || (auth.role !== "TEACHER" && auth.role !== "SUPER_ADMIN")) {
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

    const enrollment = await ClassService.enrollStudent(classId, studentId);

    return NextResponse.json({
      message: "Enrollment successful",
      enrollment,
    });
  } catch (error: any) {
    // Prisma unique constraint error code
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This student is already enrolled in this class." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Server error during enrollment" },
      { status: 500 },
    );
  }
}
