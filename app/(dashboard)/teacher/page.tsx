import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Teacher Dashboard</h1>

      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Welcome back, <span className="font-semibold text-primary">{session.user?.name}</span>! Here you can manage courses, review student progress, and assign new tasks.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Classes</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Create new classes, update materials, and keep your students on track.
          </p>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Student Progress</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Quickly review performance summaries and spot students who need help.
          </p>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
