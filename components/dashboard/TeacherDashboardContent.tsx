// app/components/dashboard/TeacherDashboardContent.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherClassesView from "./TeacherClassesView";

type ClassStudent = {
  id: string;
  studyPlans?: Array<{ tasks?: Array<{ completed?: boolean }> }>;
};

type ClassEnrollment = {
  student?: ClassStudent;
};

type ClassData = {
  enrollments?: ClassEnrollment[];
};

export default function TeacherDashboardContent() {
  const [activeTab, setActiveTab] = useState<"classes" | "students" | "progress" | "exams">("classes");
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeClasses, setActiveClasses] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState("N/A");
  const [activeExams, setActiveExams] = useState(0);

  useEffect(() => {
    // Listen for tab change events from sidebar
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setActiveTab(customEvent.detail.tab);
    };

    window.addEventListener("teacher-tab-change", handleTabChange);
    return () => window.removeEventListener("teacher-tab-change", handleTabChange);
  }, []);



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/classes?type=teacher");
        if (!response.ok) {
          console.error("Failed to fetch teacher classes", await response.text());
          return;
        }

        const classes = (await response.json()) as ClassData[];

        if (!Array.isArray(classes)) {
          console.error("Unexpected classes response", classes);
          return;
        }

        setActiveClasses(classes.length);

        const students = new Set<string>();
        let completedTasks = 0;
        let totalTasks = 0;

        classes.forEach((cls) => {
          const enrollments = cls.enrollments || [];
          enrollments.forEach((en) => {
            if (en.student?.id) {
              students.add(en.student.id);
            }
            const studyPlans = en.student?.studyPlans || [];
            studyPlans.forEach((plan) => {
              (plan.tasks || []).forEach((task) => {
                totalTasks += 1;
                if (task.completed) completedTasks += 1;
              });
            });
          });
        });

        setTotalStudents(students.size);
        setAvgCompletion(totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : "N/A");
        setActiveExams(0); // no exam concrete endpoint yet
      } catch (err) {
        console.error("Teacher stats fetch error", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Teacher Dashboard" />

        <div className="flex-1 overflow-auto p-6 lg:p-8 space-y-8 bg-white m-4 rounded-3xl shadow-sm">
          <TeacherStatsCards
            totalStudents={totalStudents}
            activeClasses={activeClasses}
            avgCompletion={avgCompletion}
            activeExams={activeExams}
          />

          <div className="mt-2">
            {activeTab === "classes" && <TeacherClassesView />}
            {activeTab === "students" && <div className="bg-gray-50 rounded-3xl p-20 text-center text-gray-500">All Students - Coming Soon</div>}
            {activeTab === "progress" && <div className="bg-gray-50 rounded-3xl p-20 text-center text-gray-500">Progress - Coming Soon</div>}
            {activeTab === "exams" && <div className="bg-gray-50 rounded-3xl p-20 text-center text-gray-500">Exams - Coming Soon</div>}
          </div>
        </div>
      </div>
    </div>
  );
}