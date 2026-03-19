import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton"; // Import here

export default async function StudentProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Student Dashboard
      </h1>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back,{" "}
          <span className="font-bold text-blue-600">{session.user?.name}</span>!
        </p>

        {/* Profile Details */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-500">Email: {session.user?.email}</p>
          <p className="text-sm text-gray-500">
            Role: {(session.user as any).role}
          </p>
        </div>

        {/* The Sign Out Button */}
        <LogoutButton />
      </div>
    </div>
  );
}
