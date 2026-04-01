// app/dashboard/teacher/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import TeacherDashboardContent from "@/components/dashboard/TeacherDashboardContent";

export default async function TeacherDashboard() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return <TeacherDashboardContent />;
}
