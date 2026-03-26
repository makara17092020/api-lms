import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ classId: string; studentid: string }> }, // 👈 1. Lowercase 'studentid'
) {
  try {
    const resolvedParams = await params;

    // 👈 2. Match the exact folder spelling
    const classId = resolvedParams.classId;
    const studentId = resolvedParams.studentid;

    if (!classId || !studentId) {
      return NextResponse.json(
        { error: "Missing classId or studentid in URL" },
        { status: 400 },
      );
    }

    // 3. Remove the enrollment link
    await prisma.enrollment.delete({
      where: {
        classId_studentId: {
          classId: classId,
          studentId: studentId,
        },
      },
    });

    return NextResponse.json(
      { message: "Student removed from class" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[REMOVE_STUDENT_ERROR]", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Record not found or already removed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
