"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardNav() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  if (!role) return null;

  return (
    <nav className="flex flex-col gap-2">
      {role === "STUDENT" && (
        <>
          <Link href="/dashboard/student">My AI Plans</Link>
          <Link href="/dashboard/student/tasks">Tasks</Link>
        </>
      )}
      {role === "TEACHER" && (
        <>
          <Link href="/dashboard/teacher/classes">Classes</Link>
          <Link href="/dashboard/teacher/exams">Exams</Link>
        </>
      )}
      {role === "SUPER_ADMIN" && (
        <>
          <Link href="/dashboard/admin/users">Manage Users</Link>
          <Link href="/dashboard/admin/classes">All Classes</Link>
        </>
      )}
    </nav>
  );
}
