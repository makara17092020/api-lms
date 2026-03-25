import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ClassService } from "@/app/services/class.servide";

// Helper to verify if the user is the teacher of the class or an admin
async function verifyOwnership(classId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return { error: "Unauthorized", status: 401 };

  try {
    // Ensure this matches the secret name used in your main route.ts
    const secret = new TextEncoder().encode(
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET!,
    );
    const { payload } = await jwtVerify(token, secret);
    const auth = payload as { id: string; role: string };

    const cls = await ClassService.findClassById(classId);
    if (!cls) return { error: "Class not found", status: 404 };

    const isOwner = cls.teacherId === auth.id;
    const isAdmin = auth.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return { error: "Forbidden: Access denied", status: 403 };
    }

    return { auth, cls };
  } catch (err) {
    return { error: "Unauthorized", status: 401 };
  }
}

// PUT: Update Class
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
    const { className, teacherId } = await req.json(); // Extract both

    if (!className || !teacherId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const updated = await ClassService.updateClass(
      classId,
      className,
      teacherId,
    );
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Delete Class
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ classId: string }> }, // Define as Promise
) {
  const { classId } = await params; // Unwrapping the promise

  const verification = await verifyOwnership(classId);
  if ("error" in verification) {
    return NextResponse.json(
      { error: verification.error },
      { status: verification.status },
    );
  }

  try {
    await ClassService.deleteClass(classId);
    return NextResponse.json({ message: "Class successfully wiped out" });
  } catch {
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
