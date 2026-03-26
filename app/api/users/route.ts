import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// --- 1. GET ALL USERS + METRICS (Can filter by ?role=TEACHER) ---
export async function GET(req: Request) {
  const url = new URL(req.url);
  const roleQuery = url.searchParams.get("role"); // Grabs "TEACHER" or "STUDENT" if passed

  try {
    // Determine filter constraints dynamically
    const whereClause = roleQuery
      ? { role: roleQuery as "SUPER_ADMIN" | "TEACHER" | "STUDENT" }
      : {};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
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

    // or calculate only on the filtered context if a filter is present.
    let totalUsers = users.length;
    let students = users.filter((u) => u.role === "STUDENT").length;
    let teachers = users.filter((u) => u.role === "TEACHER").length;

    // If we are filtering just for drop-downs, let's pull accurate global metrics anyway
    if (roleQuery) {
      const globalCounts = await prisma.user.groupBy({
        by: ["role"],
        _count: { _all: true },
      });

      totalUsers = globalCounts.reduce(
        (acc, curr) => acc + curr._count._all,
        0,
      );
      students =
        globalCounts.find((g) => g.role === "STUDENT")?._count._all || 0;
      teachers =
        globalCounts.find((g) => g.role === "TEACHER")?._count._all || 0;
    }

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
    const { name, email, password, role, image } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 },
      );
    }

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

    // Strip password for safety
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
