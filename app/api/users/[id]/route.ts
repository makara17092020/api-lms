import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type RouteParams = { params: Promise<{ id: string }> };

// --- 1. GET SINGLE USER ---
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        classes: true,
        _count: {
          select: {
            classes: true,
            studyPlans: true,
            results: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[GET_SINGLE_USER_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// --- 2. UPDATE USER (Fixed image extraction!) ---
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { name, email, role, password, image } = body;

    const updateData: any = {
      name,
      email,
      role,
      image: image || null, // Saves Cloudinary URL safely
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[UPDATE_USER_ERROR]:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// --- 3. DELETE USER SAFELY ---
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // 👈 1. Strictly Type the Promise
) {
  // Define it here so it's accessible inside the try block AND the catch block!
  let userId: string | null = null;

  try {
    const resolvedParams = await params;
    userId = resolvedParams.id; // 👈 2. Safely extract 'id'

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.$transaction([
      // A. Clear out dependent child records (Enrollments, Class connections, etc.)
      prisma.$executeRaw`DELETE FROM "Enrollment" WHERE "studentId" = ${userId} OR "classId" IN (SELECT "id" FROM "Class" WHERE "teacherId" = ${userId});`,
      prisma.$executeRaw`DELETE FROM "Class" WHERE "teacherId" = ${userId};`,

      // B. Finally wipe the parent User
      prisma.$executeRaw`DELETE FROM "User" WHERE "id" = ${userId};`,
    ]);

    return NextResponse.json(
      { message: "User wiped successfully!" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[NUCLEAR_DELETE_ERROR]", error);

    // Fallback if standard queries fail (handles lowercase schema tables)
    try {
      if (userId) {
        await prisma.$transaction([
          prisma.$executeRaw`DELETE FROM enrollment WHERE student_id = ${userId} OR class_id IN (SELECT id FROM class WHERE teacher_id = ${userId});`,
          prisma.$executeRaw`DELETE FROM class WHERE teacher_id = ${userId};`,
          prisma.$executeRaw`DELETE FROM "user" WHERE id = ${userId};`,
        ]);
        return NextResponse.json(
          { message: "User wiped via fallback!" },
          { status: 200 },
        );
      }
    } catch (fallbackError) {
      console.error("[FALLBACK_ERROR]", fallbackError);
    }

    return NextResponse.json(
      { error: "Postgres hard-blocked the delete. Clear it via Neon console." },
      { status: 500 },
    );
  }
}
