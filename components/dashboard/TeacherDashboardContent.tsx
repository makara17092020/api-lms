// app/components/dashboard/TeacherDashboardContent.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherClassesView from "./TeacherClassesView";

export default function TeacherDashboardContent() {
  const [activeTab, setActiveTab] = useState<"classes" | "students" | "progress" | "exams">("classes");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Teacher Dashboard" />

        <div className="flex-1 overflow-auto p-6 lg:p-8 space-y-8">
          <div className="flex border-b border-gray-200 bg-white rounded-3xl p-1 shadow-sm">
            {["classes", "students", "progress", "exams"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-sm font-medium rounded-2xl transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <TeacherStatsCards />

          <div className="mt-2">
            {activeTab === "classes" && <TeacherClassesView />}
            {activeTab === "students" && <div className="bg-white rounded-3xl p-20 text-center text-gray-500">All Students - Coming Soon</div>}
            {activeTab === "progress" && <div className="bg-white rounded-3xl p-20 text-center text-gray-500">Progress - Coming Soon</div>}
            {activeTab === "exams" && <div className="bg-white rounded-3xl p-20 text-center text-gray-500">Exams - Coming Soon</div>}
          </div>
        </div>
      </div>
    </div>
  );
}