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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Student Dashboard
      </h1>

      <div className="space-y-4">
        <p className="text-slate-600 dark:text-slate-300">
          Welcome back, <span className="font-bold text-primary">{session.user?.name}</span>!
        </p>

        {/* Profile Details */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
          <p className="text-sm text-slate-500 dark:text-slate-400">Email: {session.user?.email}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Role: {(session.user as any).role}
          </p>
        </div>

        {/* The Sign Out Button */}
        <LogoutButton />
      </div>
    </div>
  );
}
