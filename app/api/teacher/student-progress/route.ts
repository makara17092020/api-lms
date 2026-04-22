import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const auth = await getAuth();
  if (!auth || (auth.role !== "TEACHER" && auth.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        enrollments: {
          some: {
            // 1. Filter by the class selected in the dropdown
            ...(classId && classId !== "all" ? { classId: classId } : {}),
            // 2. ONLY show students in classes where THIS teacher is assigned
            class: { teacherId: auth.id },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        enrollments: {
          where: { class: { teacherId: auth.id } }, // Only show relevant class info
          select: {
            class: { select: { id: true, className: true } },
          },
        },
        studyPlans: {
          select: {
            id: true,
            tasks: { select: { isCompleted: true } },
          },
        },
      },
    });

    const studentsWithMetrics = students.map((student) => {
      const allTasks = student.studyPlans.flatMap((plan) => plan.tasks);
      return {
        id: student.id,
        name: student.name || "Anonymous",
        email: student.email,
        profileImage: student.image || null,
        classId: student.enrollments[0]?.class?.id || "unassigned",
        className: student.enrollments[0]?.class?.className || "Unassigned",
        totalPlans: student.studyPlans.length,
        completedTasks: allTasks.filter((t) => t.isCompleted).length,
        totalTasks: allTasks.length,
      };
    });

    return NextResponse.json(studentsWithMetrics);
  } catch (error) {
    console.error("FETCH_ERROR:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
