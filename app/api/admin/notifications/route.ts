import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [recentPlans, recentUsers] = await Promise.all([
      prisma.studyPlan.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { student: { select: { name: true } } },
      }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const notifications = [
      ...recentPlans.map((p) => ({
        id: `plan-${p.id}`,
        type: "PLAN",
        message: `${p.student.name} generated a new study plan`,
        time: p.createdAt,
        link: "/admin/study-plans",
      })),
      ...recentUsers.map((u) => ({
        id: `user-${u.id}`,
        type: "USER",
        message: `New student registered: ${u.name}`,
        time: u.createdAt,
        link: "/admin/users", // Correct path based on your dashboard
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
