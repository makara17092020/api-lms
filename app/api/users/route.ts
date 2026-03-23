import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// --- 1. GET ALL USERS + METRICS ---
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true, // 👈 Added so the frontend can fetch image URLs!
        createdAt: true,
        _count: {
          select: {
            classes: true,
            studyPlans: true,
            results: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Count metrics directly from the fetched array
    const totalUsers = users.length;
    const students = users.filter((u) => u.role === "STUDENT").length;
    const teachers = users.filter((u) => u.role === "TEACHER").length;

    return NextResponse.json({
      metrics: {
        totalUsers,
        students,
        teachers,
      },
      users,
    });
  } catch (error) {
    console.error("[GET_USERS_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

// --- 2. CREATE NEW USER ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 👈 Destructured image from the incoming body payload!
    const { name, email, password, role, image } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 },
      );
    }

    // Hash the password safely
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
        image: image || null,
      },
    });

    // Exclude password from the returned object for security
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("[POST_USER_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
