// app/components/dashboard/TeacherDashboardContent.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherClassesView from "./TeacherClassesView";

export default function TeacherDashboardContent() {
  const [activeTab, setActiveTab] = useState<"classes" | "students" | "progress" | "exams">("classes");
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeClasses, setActiveClasses] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState("N/A");
  const [activeExams, setActiveExams] = useState(0);

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

        classes.forEach((cls: any) => {
          const enrollments = cls.enrollments || cls.students || [];
          enrollments.forEach((en: any) => {
            const student = en.student || en;
            if (student?.id) studentsSet.add(student.id);

            const studyPlans = student?.studyPlans || [];
            studyPlans.forEach((plan: any) => {
              (plan.tasks || []).forEach((task: any) => {
                total++;
                if (task.completed) completed++;
              });
            });
          });
        });

        setTotalStudents(studentsSet.size);
        setAvgCompletion(total > 0 ? `${Math.round((completed / total) * 100)}%` : "N/A");
      } catch (err) {
        console.error("Stats fetch error", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Teacher Dashboard" />

        <div className="flex-1 overflow-auto p-6 lg:p-8 space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white rounded-3xl p-1 shadow-sm overflow-x-auto">
            {["classes", "students", "progress", "exams"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-6 text-sm font-medium rounded-2xl transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <TeacherStatsCards
            totalStudents={totalStudents}
            activeClasses={activeClasses}
            avgCompletion={avgCompletion}
            activeExams={activeExams}
          />

          {/* Tab Content */}
          <div className="mt-2">
            {activeTab === "classes" && <TeacherClassesView />}
            {activeTab === "students" && (
              <div className="bg-white rounded-3xl p-20 text-center text-gray-500">
                All Students Management - Coming Soon
              </div>
            )}
            {activeTab === "progress" && (
              <div className="bg-white rounded-3xl p-20 text-center text-gray-500">
                Progress Analytics - Coming Soon
              </div>
            )}
            {activeTab === "exams" && (
              <div className="bg-white rounded-3xl p-20 text-center text-gray-500">
                Exam Management - Coming Soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}