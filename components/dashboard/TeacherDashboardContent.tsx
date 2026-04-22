"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TeacherClassesView from "./TeacherClassesView";
import { Menu, Users, BookOpen, BarChart3, GraduationCap } from "lucide-react";

export default function TeacherDashboardContent() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("classes");

  // Data States
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    avgCompletion: "0%",
    activeExams: 0,
  });
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [studyPlansData, setStudyPlansData] = useState<any[]>([]);

  useEffect(() => {
    if (pathname.endsWith("/students")) setActiveView("students");
    else if (pathname.endsWith("/plans")) setActiveView("plans");
    else setActiveView("classes");
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch("/api/classes?type=teacher");
        if (!res.ok) return;
        const classes = await res.json();

        const studentsSet = new Set();
        let completed = 0,
          total = 0;
        const studentsList: any[] = [];

        classes.forEach((cls: any) => {
          (cls.enrollments || cls.students || []).forEach((en: any) => {
            const s = en.student || en;
            if (s?.id) {
              studentsSet.add(s.id);
              studentsList.push({ ...s, className: cls.name, classId: cls.id });
              (s.studyPlans || []).forEach((p: any) => {
                (p.tasks || []).forEach((t: any) => {
                  total++;
                  if (t.completed) completed++;
                });
              });
            }
          });
        });

        setStats({
          totalStudents: studentsSet.size,
          activeClasses: classes.length,
          avgCompletion:
            total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%",
          activeExams: 0, // Placeholder
        });
        setStudentsData(studentsList);
      } catch (err) {
        console.error("Data fetch error", err);
      }
    };
    fetchTeacherData();
  }, []);

  // Reusable Stat Card Component
  const StatCard = ({ icon: Icon, label, value, colorClass }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
      <div className={`p-3 rounded-2xl ${colorClass} mb-3`}>
        <Icon size={24} />
      </div>
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      <span className="text-sm font-medium text-gray-500 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Teacher Dashboard"
          leftContent={
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-2 mr-2 text-gray-600 lg:hidden hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          }
        />

        <div className="flex-1 overflow-auto p-4 md:p-8 space-y-8">
          {/* Refined Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              icon={Users}
              label="Total Students"
              value={stats.totalStudents}
              colorClass="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={BookOpen}
              label="Active Classes"
              value={stats.activeClasses}
              colorClass="bg-purple-50 text-purple-600"
            />
            <StatCard
              icon={BarChart3}
              label="Avg. Completion"
              value={stats.avgCompletion}
              colorClass="bg-pink-50 text-pink-600"
            />
            <StatCard
              icon={GraduationCap}
              label="Active Exams"
              value={stats.activeExams}
              colorClass="bg-emerald-50 text-emerald-600"
            />
          </div>

          <div className="mt-2">
            {activeView === "classes" && <TeacherClassesView />}

            {activeView === "students" && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Enrolled Students
                </h2>
                <div className="grid gap-4">
                  {studentsData.map((student, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                          {student.name?.[0] || "S"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {student.className}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
