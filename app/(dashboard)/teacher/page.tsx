import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function TeacherDashboardPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userRole = cookieStore.get("userRole")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Teacher Dashboard
      </h1>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">Welcome back, educator!</p>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500">
            Role: <span className="font-semibold text-blue-600">{userRole || "TEACHER"}</span>
          </p>
        </div>

        <div className="w-full pt-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
