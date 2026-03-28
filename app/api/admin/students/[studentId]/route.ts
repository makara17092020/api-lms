import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }, // Next.js 15+ async params
) {
  try {
    const session = await getServerSession();
    const userRole = session?.user?.role;

    // 🛡️ Only Super Admins and Teachers can view this profile
    if (
      !session ||
      !userRole ||
      (userRole !== "SUPER_ADMIN" && userRole !== "TEACHER")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { studentId } = resolvedParams;

    if (!studentId) {
      return NextResponse.json(
        { error: "Missing student ID" },
        { status: 400 },
      );
    }

    const studentData = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true, // Pulls the profile image URL or Base64 string
        studyPlans: {
          include: {
            tasks: { orderBy: { dayNumber: "asc" } },
          },
          orderBy: { createdAt: "desc" },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                title: true, // Pulls the question title for the UI context
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!studentData) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(studentData);
  } catch (error) {
    console.error("[GET_STUDENT_PROFILE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
