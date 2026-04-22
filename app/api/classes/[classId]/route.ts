import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ClassService } from "@/app/services/class.servide"; // Ensure correct spelling: .service vs .servide

/**
 * Internal helper to verify the user's session and permission.
 * Uses ACCESS_TOKEN_SECRET from your .env file.
 */
async function verifyOwnership(classId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    console.error("Auth Error: No accessToken found in cookies.");
    return { error: "Unauthorized", status: 401 };
  }

  try {
    // Standardizing to use the key from your provided .env
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
      console.error("Config Error: ACCESS_TOKEN_SECRET is missing in .env");
      return { error: "Internal Server Error", status: 500 };
    }

    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    const auth = payload as { id: string; role: string };

    const cls = await ClassService.findClassById(classId);
    if (!cls) return { error: "Class not found", status: 404 };

    // Permission Logic: Super Admins can edit anything; Teachers can only edit their own
    const isOwner = cls.teacherId === auth.id;
    const isAdmin = auth.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      console.warn(
        `Permission Denied: User ${auth.id} attempted to access Class ${classId}`,
      );
      return { error: "Forbidden: Access denied", status: 403 };
    }

    return { auth, cls };
  } catch (err) {
    console.error("JWT Error:", err);
    return { error: "Unauthorized", status: 401 };
  }
}

/**
 * UPDATED PUT: Handle Class Updates AND Student Unenrollment
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;

  const verification = await verifyOwnership(classId);
  if ("error" in verification) {
    return NextResponse.json(
      { error: verification.error },
      { status: verification.status },
    );
  }

  try {
    const body = await req.json();
    const { className, teacherId, removeStudentId } = body;

    // --- FIX: Use your existing unenrollStudent method ---
    if (removeStudentId) {
      await ClassService.unenrollStudent(classId, removeStudentId);
      return NextResponse.json({ message: "Student unenrolled successfully" });
    }

    // Standard Class Update
    if (!className || !teacherId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updated = await ClassService.updateClass(
      classId,
      className,
      teacherId,
    );
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Operation Failed:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Remove a Class
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;

  const verification = await verifyOwnership(classId);
  if ("error" in verification) {
    return NextResponse.json(
      { error: verification.error },
      { status: verification.status },
    );
  }

  try {
    await ClassService.deleteClass(classId);
    return NextResponse.json({ message: "Class successfully deleted" });
  } catch (err) {
    console.error("Delete Operation Failed:", err);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
