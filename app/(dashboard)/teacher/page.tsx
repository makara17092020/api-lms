import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function TeacherProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Teacher Dashboard
      </h1>

      <div className="space-y-4">
        <p className="text-gray-600">
          Welcome, {session.user?.name || session.user?.email}!
        </p>
        <p className="text-sm text-gray-500">
          Role: Teacher
        </p>
        <LogoutButton />
      </div>
    </div>
  );
}