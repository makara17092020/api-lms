// app/components/dashboard/TeacherDashboardContent.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherClassesView from "./TeacherClassesView";

export default function TeacherDashboardContent() {
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<
    "classes" | "students" | "plans"
  >("classes");
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeClasses, setActiveClasses] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState("N/A");
  const [activeExams, setActiveExams] = useState(0);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [studyPlansData, setStudyPlansData] = useState<any[]>([]);

  // Determine active view based on pathname
  useEffect(() => {
    if (pathname.endsWith("/students")) {
      setActiveView("students");
    } else if (pathname.endsWith("/plans")) {
      setActiveView("plans");
    } else {
      setActiveView("classes");
    }
  }, [pathname]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/classes?type=teacher");
        if (!res.ok) return;

        const classes = await res.json();
        if (!Array.isArray(classes)) return;

        setActiveClasses(classes.length);

        const studentsSet = new Set();
        let completed = 0;
        let total = 0;
        const studentsList: any[] = [];

        classes.forEach((cls: any) => {
          const enrollments = cls.enrollments || cls.students || [];
          enrollments.forEach((en: any) => {
            const student = en.student || en;
            if (student?.id) {
              studentsSet.add(student.id);
              studentsList.push({
                ...student,
                className: cls.name,
                classId: cls.id,
              });

              const studyPlans = student?.studyPlans || [];
              studyPlans.forEach((plan: any) => {
                (plan.tasks || []).forEach((task: any) => {
                  total++;
                  if (task.completed) completed++;
                });
              });
            }
          });
        });

        setTotalStudents(studentsSet.size);
        setStudentsData(studentsList);
        setAvgCompletion(
          total > 0 ? `${Math.round((completed / total) * 100)}%` : "N/A",
        );
      } catch (err) {
        console.error("Stats fetch error", err);
      }
    };

    fetchStats();
  }, []);

  // Fetch study plans data
  useEffect(() => {
    const fetchStudyPlans = async () => {
      try {
        const res = await fetch("/api/admin/study-plans/progress");
        if (!res.ok) return;

        const allStudentsWithPlans = await res.json();
        if (Array.isArray(allStudentsWithPlans)) {
          // Filter to only show students enrolled in teacher's classes
          const teacherStudentIds = new Set(
            studentsData.map((student) => student.id),
          );
          const teacherStudentsWithPlans = allStudentsWithPlans.filter(
            (student: any) =>
              teacherStudentIds.has(student.id) && student.totalPlans > 0,
          );
          setStudyPlansData(teacherStudentsWithPlans);
        }
      } catch (err) {
        console.error("Study plans fetch error", err);
      }
    };

    if (studentsData.length > 0) {
      fetchStudyPlans();
    }
  }, [studentsData]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Teacher Dashboard" />

        <div className="flex-1 overflow-auto p-6 lg:p-8 space-y-8">
          {/* Stats Cards */}
          <TeacherStatsCards
            totalStudents={totalStudents}
            activeClasses={activeClasses}
            avgCompletion={avgCompletion}
            activeExams={activeExams}
          />

          {/* Content */}
          <div className="mt-2">
            {activeView === "classes" && <TeacherClassesView />}
            {activeView === "students" && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 rounded-xl">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        My Students
                      </h2>
                      <p className="text-sm text-gray-500">
                        {studentsData.length} students enrolled across{" "}
                        {activeClasses} classes
                      </p>
                    </div>
                  </div>
                </div>

                {studentsData.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      No students enrolled yet
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                      Students will appear here once they enroll in your
                      classes.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:gap-6">
                    {studentsData.map((student, index) => (
                      <div
                        key={`${student.id}-${student.classId}`}
                        className="group relative bg-linear-to-r from-white to-gray-50/50 border border-gray-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">
                                  {student.name?.charAt(0)?.toUpperCase() ||
                                    student.email?.charAt(0)?.toUpperCase() ||
                                    "S"}
                                </span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <svg
                                  className="w-2.5 h-2.5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {student.name || "Unnamed Student"}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {student.email}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                  </svg>
                                  {student.className}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              Student #{index + 1}
                            </div>
                            <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeView === "plans" && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 rounded-xl">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Student Study Plans
                      </h2>
                      <p className="text-sm text-gray-500">
                        {studyPlansData.length} active study plans • Monitor
                        student progress
                      </p>
                    </div>
                  </div>
                </div>

                {studyPlansData.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      No study plans yet
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                      Students haven't created personalized learning paths yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {studyPlansData.map((student) => {
                      const progressPercentage =
                        student.totalTasks > 0
                          ? Math.round(
                              (student.completedTasks / student.totalTasks) *
                                100,
                            )
                          : 0;

                      return (
                        <div
                          key={student.id}
                          className="bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {student.name?.charAt(0)?.toUpperCase() ||
                                    "S"}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">
                                  {student.name}
                                </h3>
                                <p className="text-xs text-gray-600">
                                  {student.className}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">
                                Progress
                              </div>
                              <div className="text-lg font-bold text-purple-600">
                                {progressPercentage}%
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>
                                {student.completedTasks} of {student.totalTasks}{" "}
                                tasks completed
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-linear-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {student.totalPlans} Study Plan
                              {student.totalPlans !== 1 ? "s" : ""}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full ${
                                progressPercentage === 100
                                  ? "bg-green-100 text-green-700"
                                  : progressPercentage > 50
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {progressPercentage === 100
                                ? "Complete"
                                : progressPercentage > 50
                                  ? "In Progress"
                                  : "Just Started"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
