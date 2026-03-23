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
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Super Admins cannot be deleted." },
        { status: 403 },
      );
    }

    // Wipe constraints safely via transaction
    await prisma.$transaction([
      prisma.result.deleteMany({ where: { studentId: id } }),
      prisma.studyPlan.deleteMany({ where: { studentId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("[DELETE_USER_ERROR]:", error);
    return NextResponse.json(
      { error: "Could not delete user. Related constraints are active." },
      { status: 500 },
    );
  }
}
