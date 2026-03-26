import { prisma } from "@/lib/prisma";

export class ClassService {
  /**
   * 1. Create a Class (Teachers & Admins only)
   */
  static async createClass(className: string, teacherId: string) {
    return prisma.class.create({
      data: { className, teacherId },
      include: {
        teacher: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * 2. Find Class by ID
   */
  static async findClassById(classId: string) {
    return prisma.class.findUnique({
      where: { id: classId },
      include: { teacher: { select: { id: true, name: true, role: true } } },
    });
  }

  /**
   * 3. Update Class (Supports changing Instructor)
   */
  static async updateClass(
    classId: string,
    className: string,
    teacherId: string,
  ) {
    return prisma.class.update({
      where: { id: classId },
      data: {
        className,
        teacherId,
      },
      include: {
        teacher: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * 4. Delete Class
   */
  static async deleteClass(classId: string) {
    return prisma.class.delete({
      where: { id: classId },
    });
  }

  /**
   * 5. Get classes taught by a teacher (UPDATED to pull live student study plans!)
   */
  static async getClassesByTeacher(teacherId: string) {
    return prisma.class.findMany({
      where: { teacherId },
      include: {
        _count: { select: { enrollments: true } }, // Pull metrics
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                studyPlans: {
                  include: {
                    tasks: {
                      orderBy: { dayNumber: "asc" },
                    },
                  },
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

  /**
   * 6. Get classes a student is enrolled in
   */
  static async getClassesByStudent(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        class: {
          include: {
            teacher: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Isolate the class object and return it
    return enrollments.map((e) => e.class);
  }

  /**
   * 7. Add Student to Class (Enrollment)
   */
  static async enrollStudent(classId: string, studentId: string) {
    // Verify target user is a student
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== "STUDENT") {
      throw new Error("Target user is not a valid student profile.");
    }

    return prisma.enrollment.create({
      data: { classId, studentId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * 8. Remove Student from Class
   */
  static async unenrollStudent(classId: string, studentId: string) {
    return prisma.enrollment.delete({
      where: {
        classId_studentId: { classId, studentId }, // Matches the @@unique in schema
      },
    });
  }

  /**
   * 9. Get all students enrolled in a class
   */
  static async getEnrolledStudents(classId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { classId },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return enrollments.map((e) => e.student);
  }

  /**
   * 10. Get ALL classes (Super Admin view)
   */
  static async getAllClasses() {
    return prisma.class.findMany({
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
