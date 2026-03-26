import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
<<<<<<< HEAD
<<<<<<< HEAD
=======
// Check spelling: Ensure it's .service and not .servide
>>>>>>> 543a78e (merge conflig code)
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
<<<<<<< HEAD
    // Standardizing to your .env variable
=======
    // Standardizing to your .env variable for security
>>>>>>> 543a78e (merge conflig code)
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
  // 1. Unwrapping params for Next.js 15/16 compatibility
  const { classId } = await params;
  const auth = await getAuth();

<<<<<<< HEAD
<<<<<<< HEAD
=======
  // 2. Authorization Check (Allow both Super Admins and Teachers)
>>>>>>> 543a78e (merge conflig code)
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
<<<<<<< HEAD
        { error: "Student ID is required" },
=======
        { error: "Student selection required" },
>>>>>>> f2c1b3b (fix error)
=======
        { error: "Student selection required" },
>>>>>>> 543a78e (merge conflig code)
        { status: 400 },
      );
    }

    // 3. Database Operation via Service
    const enrollment = await ClassService.enrollStudent(classId, studentId);

    return NextResponse.json({
<<<<<<< HEAD
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (error: any) {
    // 4. Handle Prisma Unique Constraint (P2002: Student already enrolled)
    if (error.code === "P2002") {
      return NextResponse.json(
<<<<<<< HEAD
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
=======
        { error: "This student is already enrolled in this class." },
>>>>>>> 543a78e (merge conflig code)
        { status: 409 },
      );
    }

    console.error("Enrollment error:", error);
    return NextResponse.json(
<<<<<<< HEAD
<<<<<<< HEAD
      { error: error.message || "Enrollment failed" },
=======
      { error: "Server error during enrollment" },
>>>>>>> f2c1b3b (fix error)
=======
      { error: error.message || "Server error during enrollment" },
>>>>>>> 543a78e (merge conflig code)
      { status: 500 },
    );
  }
}
