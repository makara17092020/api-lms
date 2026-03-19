// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth(); // ← no req here!

  if (!session?.user) {
    redirect("/auth/login");
  }

  const role = session.user.role;

  if (role === "SUPER_ADMIN") redirect("/dashboard/admin");
  if (role === "TEACHER") redirect("/dashboard/teacher");
  redirect("/dashboard/student");
}
