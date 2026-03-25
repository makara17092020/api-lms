<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, GraduationCap } from "lucide-react";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch("/api/classes?type=teacher");
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch teacher data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  return (
    <div className="p-10 space-y-12 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <header className="flex items-center gap-3">
        <div className="p-3 bg-linear-to-br from-teal-400 to-emerald-500 rounded-3xl text-white shadow-lg">
          <GraduationCap size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Teacher Workspace
          </h1>
          <p className="text-gray-500">
            Track your students' automated AI study metrics.
          </p>
        </div>
      </header>

      {loading ? (
        <span className="animate-spin text-3xl">🌀</span>
      ) : (
        <div className="space-y-10">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Class: {cls.className}
              </h2>

              <div className="space-y-6">
                {cls.enrollments?.map((enrollment: any) => (
                  <div
                    key={enrollment.id}
                    className="p-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                        {enrollment.student.name?.[0] || "S"}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {enrollment.student.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {enrollment.student.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">
                        Active Study Plans
                      </p>
                      {enrollment.student.studyPlans?.map((plan: any) => (
                        <div
                          key={plan.id}
                          className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-white/10"
                        >
                          <h4 className="font-bold text-gray-800 dark:text-white">
                            {plan.topic}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {plan.tasks?.map((task: any) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg"
                              >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Day {task.dayNumber}: {task.taskDescription}
                                </span>
                                {task.isCompleted ? (
                                  <CheckCircle2
                                    size={18}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <Circle size={18} className="text-gray-400" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
=======
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
>>>>>>> 6d93959 (OAuth update)
    </div>
  );
}
