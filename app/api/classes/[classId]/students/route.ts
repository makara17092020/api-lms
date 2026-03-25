import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
<<<<<<< HEAD
import { ClassService } from "@/app/services/class.servide";
=======
import { ClassService } from "@/app/services/class.servide"; // Ensure correct spelling: .service vs .servid
>>>>>>> f2c1b3b (fix error)

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
<<<<<<< HEAD
    // Standardizing to your .env variable
    const secretKey = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    const secret = new TextEncoder().encode(secretKey!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch (err) {
    console.error("JWT Verification failed:", err);
=======
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch {
>>>>>>> f2c1b3b (fix error)
    return null;
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params; // Required for Next.js 15
  const auth = await getAuth();

<<<<<<< HEAD
  if (!auth || (auth.role !== "SUPER_ADMIN" && auth.role !== "TEACHER")) {
=======
  if (!auth || (auth.role !== "TEACHER" && auth.role !== "SUPER_ADMIN")) {
>>>>>>> f2c1b3b (fix error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return NextResponse.json(
<<<<<<< HEAD
        { error: "Student ID is required" },
=======
        { error: "Student selection required" },
>>>>>>> f2c1b3b (fix error)
        { status: 400 },
      );
    }

    const enrollment = await ClassService.enrollStudent(classId, studentId);

    return NextResponse.json({
<<<<<<< HEAD
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error: any) {
    // Handle Prisma unique constraint (student already enrolled)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Student is already in this class" },
=======
      message: "Enrollment successful",
      enrollment,
    });
  } catch (error: any) {
    // Prisma unique constraint error code
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This student is already enrolled in this class." },
>>>>>>> f2c1b3b (fix error)
        { status: 409 },
      );
    }
    return NextResponse.json(
<<<<<<< HEAD
      { error: error.message || "Enrollment failed" },
=======
      { error: "Server error during enrollment" },
>>>>>>> f2c1b3b (fix error)
      { status: 500 },
    );
  }
}
