import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get plans created in the last 24 hours
    const recentPlans = await prisma.studyPlan.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true } },
      },
    });

    return NextResponse.json(recentPlans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
