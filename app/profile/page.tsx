import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Calendar, BookOpen, Trophy, Settings } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = session.user;
  const role = (user as any)?.role || "STUDENT";

  // Mock data for demonstration - in a real app, this would come from your database
  const stats = {
    coursesEnrolled: role === "STUDENT" ? 3 : 0,
    coursesCreated: role === "TEACHER" ? 2 : 0,
    studyPlans: role === "STUDENT" ? 1 : 0,
    completedTasks: role === "STUDENT" ? 12 : 0,
    averageScore: role === "STUDENT" ? 87 : 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {user.name || "User"}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary capitalize">
                  {role.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {role === "STUDENT" && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.coursesEnrolled}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Courses Enrolled
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.averageScore}%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Average Score
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.completedTasks}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Tasks Completed
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {role === "TEACHER" && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats.coursesCreated}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Courses Created
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <User className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      24
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Active Students
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      89%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Class Average
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {role === "SUPER_ADMIN" && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      156
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Total Users
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      42
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Active Courses
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Settings className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      99.9%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      System Uptime
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">
            {role === "STUDENT" && (
              <>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Completed "Introduction to React" module
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      2 hours ago
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-success">+95 points</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Started new study plan: "Web Development Fundamentals"
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      1 day ago
                    </p>
                  </div>
                </div>
              </>
            )}

            {role === "TEACHER" && (
              <>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Created new course: "Advanced JavaScript Concepts"
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      3 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Trophy className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Graded assignments for "React Fundamentals" class
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      1 day ago
                    </p>
                  </div>
                </div>
              </>
            )}

            {role === "SUPER_ADMIN" && (
              <>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Updated system configuration
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Reviewed user reports and resolved issues
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      1 day ago
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Account Settings
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user.name || ""}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user.email || ""}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  disabled
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-3 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Contact admin to change your role
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition">
                  Save Changes
                </button>
                <button className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
