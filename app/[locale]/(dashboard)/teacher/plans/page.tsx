"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Menu } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import StudyPlannerHeader from "@/components/study-planner/StudyPlannerHeader";
import StudyPlannerFilters from "@/components/study-planner/StudyPlannerFilters";
import StudyPlannerTable, {
  StudentProgress,
} from "@/components/study-planner/StudyPlannerTable";

export default function TeacherPlansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const currentClassId = searchParams.get("classId") || "all";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch only classes owned by this teacher
        const classRes = await fetch("/api/classes?type=teacher");
        if (classRes.ok) setClasses(await classRes.json());

        // Fetch students belonging to this teacher's classes
        const studentRes = await fetch(
          `/api/teacher/student-progress?classId=${currentClassId}`,
        );
        if (studentRes.ok) setStudents(await studentRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchData();
  }, [status, currentClassId, router]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Curriculum Planner"
          leftContent={
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 mr-2 text-slate-600 lg:hidden hover:bg-slate-100 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
          }
        />

        <main className="flex-1 overflow-auto p-4 md:p-8 space-y-8">
          <StudyPlannerHeader
            title="Academic Study Plans"
            subtitle="View and manage study progress for students in your assigned classes."
          />

          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <StudyPlannerFilters
              classes={classes}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">
              Class Roster{" "}
              <span className="text-indigo-600 ml-2">
                ({filteredStudents.length})
              </span>
            </h3>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-slate-100 overflow-hidden">
              <StudyPlannerTable
                students={filteredStudents}
                loading={loading}
                itemsPerPage={6}
                role={"teacher"}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
