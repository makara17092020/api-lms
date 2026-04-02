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

  const url = new URL(request.url);
  const studentId = url.searchParams.get("studentId");

  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        ...(studentId ? { id: studentId } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        enrollments: {
          select: {
            class: {
              select: {
                id: true, // ✅ ADD THIS: So typescript can read the ID!
                className: true,
              },
            },
          },
        },
        studyPlans: {
          select: { id: true },
        },
      },
    });

    const studentsWithMetrics = await Promise.all(
      students.map(async (student) => {
        // Now typescript knows `id` and `className` exist!
        const classId = student.enrollments[0]?.class?.id || "unassigned";
        const className =
          student.enrollments[0]?.class?.className || "Unassigned";

        const [totalTasks, completedTasks] = await Promise.all([
          prisma.task.count({
            where: { studyPlan: { studentId: student.id } },
          }),
          prisma.task.count({
            where: {
              studyPlan: { studentId: student.id },
              isCompleted: true,
            },
          }),
        ]);

        return {
          id: student.id,
          name: student.name || "Anonymous Student",
          email: student.email,
          profileImage: student.image || null,
          classId,
          className,
          totalPlans: student.studyPlans.length,
          completedTasks,
          totalTasks,
        };
      }),
    );

    return NextResponse.json(studentsWithMetrics);
  } catch (error) {
    console.error("[ADMIN_PROGRESS_FETCH_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Database Server Error" },
      { status: 500 },
    );
  }
}
