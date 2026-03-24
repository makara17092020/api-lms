import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton"; // Verify your Logout button path!

export default async function StudentProfilePage() {
  // 1. Get cookies natively in Next.js Server Components
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userRole = cookieStore.get("userRole")?.value;

  // 2. Redirect if not logged in
  if (!accessToken) {
    redirect("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Student Dashboard
      </h1>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">Welcome back!</p>

        {/* Profile Details */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500">
            Role:{" "}
            <span className="font-semibold text-blue-600">
              {userRole || "STUDENT"}
            </span>
          </p>
        </div>

        {/* Custom Logout Button */}
        <div className="w-full pt-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
