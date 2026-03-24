// app/profile/page.tsx
// 1. Import getServerSession instead of auth
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // 2. Use the dedicated server session helper
  const session = await getServerSession();

  // 3. Check for the user
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {session.user.name || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {session.user.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {session.user.role || "Student"}
          </p>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          You are authenticated. Use this page as your profile dashboard.
        </p>
      </div>
    </div>
  );
}
