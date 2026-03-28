import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    // ✅ FIX 1: Safe Optional Chaining (Prevents "user is possibly null" crash)
    const userId = session?.user?.id;
    const userRole = session?.user?.role;

    if (!session || !userId || userRole !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const search = searchParams.get("search") || "";

    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
        enrollments: {
          some:
            classId && classId !== "all"
              ? { classId: classId } // 🎯 If filtered, show students in this specific class
              : { class: { teacherId: userId } }, // ✅ FIX 2: userId is safely isolated! If "All" selected, find any student in YOUR classes.
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        studyPlans: {
          select: { id: true, topic: true },
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("[GET_STUDENTS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
