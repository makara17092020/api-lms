import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {session?.user?.name || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {session?.user?.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {(session.user as any)?.role || "Student"}
          </p>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          You are authenticated. Use this page as your profile dashboard.
        </p>
      </div>
    </div>
  );
}
