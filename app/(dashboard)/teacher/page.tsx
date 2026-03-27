// app/dashboard/teacher/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import TeacherDashboardContent from "@/components/dashboard/TeacherDashboardContent";

export default async function TeacherDashboard() {
  const session = await getServerSession();

  // Strict protection: Only TEACHER or SUPER_ADMIN allowed
  if (!session.user) {
    redirect("/");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");        // or "/unauthorized" if you create one
  }

  return <TeacherDashboardContent user={session.user} />;
}