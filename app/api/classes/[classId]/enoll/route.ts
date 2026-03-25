// app/api/classes/[classId]/enroll/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ClassService } from "@/app/services/class.servide";

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

// POST: Enroll a Student
export async function POST(
  req: Request,
  { params }: { params: { classId: string } },
) {
  const auth = await getAuth();
  if (!auth || auth.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { studentId } = await req.json();
    if (!studentId)
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 },
      );

    const enrollment = await ClassService.enrollStudent(
      params.classId,
      studentId,
    );
    return NextResponse.json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This student is already in this class" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to enroll student" },
      { status: 500 },
    );
  }
}

// GET: Get all students in a class
export async function GET(
  req: Request,
  { params }: { params: { classId: string } },
) {
  const auth = await getAuth();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const students = await ClassService.getEnrolledStudents(params.classId);
    return NextResponse.json(students);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch student indices" },
      { status: 500 },
    );
  }
}

// DELETE: Unenroll a Student
export async function DELETE(
  req: Request,
  { params }: { params: { classId: string } },
) {
  const auth = await getAuth();
  if (!auth || (auth.role !== "TEACHER" && auth.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { studentId } = await req.json();
    if (!studentId)
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 },
      );

    await ClassService.unenrollStudent(params.classId, studentId);
    return NextResponse.json({ message: "Student unenrolled successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to unenroll student" },
      { status: 500 },
    );
  }
}
