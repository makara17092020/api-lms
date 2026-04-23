import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { ClassService } from "@/app/services/class.servide";

async function verifyOwnership(classId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { error: "Unauthorized", status: 401 };

  try {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) return { error: "Internal Server Error", status: 500 };

    const secret = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, secret);
    const auth = payload as { id: string; role: string };

    const cls = await ClassService.findClassById(classId);
    if (!cls) return { error: "Class not found", status: 404 };

    const isOwner = cls.teacherId === auth.id;
    const isAdmin = auth.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) return { error: "Forbidden", status: 403 };

    return { auth, cls };
  } catch (err) {
    return { error: "Unauthorized", status: 401 };
  }
}

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
    const contentType = req.headers.get("content-type") || "";
    let studentId: string | null = null;
    let name: string | null = null;
    let email: string | null = null;
    let image: any = null;
    let removeStudentId: string | null = null;
    let className: string | null = null;
    let teacherId: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      studentId = formData.get("studentId") as string;
      name = formData.get("name") as string;
      email = formData.get("email") as string;
      image = formData.get("image");
    } else {
      const body = await req.json();
      removeStudentId = body.removeStudentId;
      className = body.className;
      teacherId = body.teacherId;
    }

    // 1. Unenroll
    if (removeStudentId) {
      await ClassService.unenrollStudent(classId, removeStudentId);
      return NextResponse.json({ message: "Student removed" });
    }

    // 2. Update Student Profile (Matches TS Types)
    if (studentId) {
      const updated = await ClassService.updateStudentProfile(studentId, {
        name: name || "",
        email: email || "",
        image: image,
      });
      return NextResponse.json(updated);
    }

    // 3. Update Class
    if (className && teacherId) {
      const updated = await ClassService.updateClass(
        classId,
        className,
        teacherId,
      );
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  } catch (err: any) {
    console.error("PUT Error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ classId: string }> },
) {
  const { classId } = await params;
  const verification = await verifyOwnership(classId);
  if ("error" in verification)
    return NextResponse.json(
      { error: verification.error },
      { status: verification.status },
    );

  try {
    await ClassService.deleteClass(classId);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
