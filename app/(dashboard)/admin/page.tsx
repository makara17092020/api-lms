import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>

      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Welcome back, <span className="font-semibold text-primary">{session.user?.name}</span>!
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            System status
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Review system metrics, manage users, and keep everything running
            smoothly.
          </p>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Quick actions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Create courses, review analytics, or configure AI settings from the
            admin panel.
          </p>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
