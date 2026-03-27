// app/components/dashboard/TeacherDashboardContent.tsx
"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherStudentTable from "./TeacherStudentTable";

export default function TeacherDashboardContent({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"students" | "classes" | "progress" | "exams">("students");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar 
          title="Teacher Dashboard" 
          userName={user?.name || "Teacher"} 
        />

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-8 space-y-8">
          {/* Simple Tabs Navigation */}
          <div className="flex border-b border-gray-200 bg-white rounded-3xl p-1 shadow-sm">
            {["students", "classes", "progress", "exams"].map((tab) => (
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

          {/* Stats Cards */}
          <TeacherStatsCards />

          {/* Tab Content */}
          <div className="mt-2">
            {activeTab === "students" && <TeacherStudentTable />}
            {activeTab === "classes" && (
              <div className="bg-white rounded-3xl p-20 text-center text-gray-500">
                Class Management - Coming Soon
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