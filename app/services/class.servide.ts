import { prisma } from "@/lib/prisma";

export class ClassService {
  /**
   * UPDATED: Update student details and handle image file conversion
   */
  static async updateStudentProfile(
    studentId: string,
    data: { name: string; email: string; image: any },
  ) {
    let imageUrl = typeof data.image === "string" ? data.image : undefined;

    // Convert uploaded File to Base64
    if (data.image && data.image instanceof File) {
      const bytes = await data.image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = data.image.type;
      const base64 = buffer.toString("base64");
      imageUrl = `data:${mimeType};base64,${base64}`;
    }

    return prisma.user.update({
      where: { id: studentId },
      data: {
        name: data.name,
        email: data.email,
        ...(imageUrl && { image: imageUrl }),
      },
    });
  }

  static async createClass(className: string, teacherId: string) {
    return prisma.class.create({
      data: { className, teacherId },
      include: { teacher: { select: { id: true, name: true, email: true } } },
    });
  }

  static async findClassById(classId: string) {
    return prisma.class.findUnique({
      where: { id: classId },
      include: { teacher: { select: { id: true, name: true, role: true } } },
    });
  }

  static async updateClass(
    classId: string,
    className: string,
    teacherId: string,
  ) {
    return prisma.class.update({
      where: { id: classId },
      data: { className, teacherId },
      include: { teacher: { select: { id: true, name: true, email: true } } },
    });
  }

  static async deleteClass(classId: string) {
    return prisma.class.delete({ where: { id: classId } });
  }

  static async getClassesByTeacher(teacherId: string) {
    return prisma.class.findMany({
      where: { teacherId },
      include: {
        _count: { select: { enrollments: true, questions: true } },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                studyPlans: {
                  include: { tasks: { orderBy: { dayNumber: "asc" } } },
                  orderBy: { createdAt: "desc" },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getClassesByStudent(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        class: { include: { teacher: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return enrollments.map((e) => e.class);
  }

  static async enrollStudent(classId: string, studentId: string) {
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== "STUDENT")
      throw new Error("Invalid student.");
    return prisma.enrollment.create({
      data: { classId, studentId },
      include: { student: { select: { id: true, name: true, email: true } } },
    });
  }

  static async unenrollStudent(classId: string, studentId: string) {
    return prisma.enrollment.delete({
      where: { classId_studentId: { classId, studentId } },
    });
  }

  static async getEnrolledStudents(classId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
      },
    });
    return enrollments.map((e) => e.student);
  }

  static async getAllClasses() {
    return prisma.class.findMany({
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        _count: { select: { enrollments: true } },
        enrollments: {
          include: {
            student: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
