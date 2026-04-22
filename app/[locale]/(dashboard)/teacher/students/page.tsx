"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherStudentTable from "@/components/dashboard/TeacherStudentTable";
import { Menu } from "lucide-react";

export default function TeacherStudentsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Student Roster"
          leftContent={
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-2 mr-2 text-gray-600 lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          }
        />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <TeacherStudentTable />
        </main>
      </div>
    </div>
  );
}
