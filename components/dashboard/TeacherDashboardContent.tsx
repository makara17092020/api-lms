// app/components/dashboard/TeacherDashboardContent.tsx
"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherStudentTable from "./TeacherStudentTable";
import TeacherClassesView from "./TeacherClassesView"; // Added from progress branch

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
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 bg-white rounded-3xl p-1 shadow-sm">
            {["students", "classes", "progress", "exams"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-sm font-medium rounded-2xl transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:shadow-sm"
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
            
            {activeTab === "classes" && <TeacherClassesView />}
            
            {activeTab === "progress" && (
              <div className="bg-white rounded-3xl p-20 text-center text-gray-500 border border-gray-100">
                Progress Analytics - Coming Soon
              </div>
            )}
            
            {activeTab === "exams" && (
              <div className="bg-white rounded-3xl p-20 text-center text-gray-500 border border-gray-100">
                Exam Management - Coming Soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}