"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import StudentProfileHeader from "@/components/admin/StudentProfileHeader";
import StudentTaskLog from "@/components/admin/StudentTaskLog";

export default function TeacherStudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>(
    {},
  );

  const fetchStudentData = async (silent = false) => {
    if (!studentId) return;
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`/api/teacher/student-progress/${studentId}`);
      if (!res.ok) throw new Error("Failed to load");

      const json = await res.json();
      setData(json);

      // Auto-expand the first plan
      if (!silent && json.studyPlans?.length > 0) {
        setExpandedPlans({ [json.studyPlans[0].id]: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
          Loading Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Roster
        </button>

        <button
          onClick={() => {
            setIsRefreshing(true);
            fetchStudentData(true);
          }}
          className="flex items-center gap-2 text-xs font-black px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Sync Progress
        </button>
      </div>

      {/* Profile Header (Shared with Admin) */}
      <StudentProfileHeader data={data} />

      {/* Study Plans Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Curriculum Path
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Assigned Modules & Tasks
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-tight border border-emerald-100">
            <Sparkles size={12} /> Live Tracking
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data.studyPlans?.map((plan: any) => {
            const isExpanded = expandedPlans[plan.id];
            const completed =
              plan.tasks?.filter((t: any) => t.isCompleted).length || 0;
            const total = plan.tasks?.length || 0;
            const progress =
              total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={plan.id}
                className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedPlans((prev) => ({
                      ...prev,
                      [plan.id]: !prev[plan.id],
                    }))
                  }
                  className="w-full flex items-center justify-between p-7 text-left group"
                >
                  <div className="flex-1 space-y-4">
                    <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                      {plan.topic}
                    </h3>
                    <div className="flex items-center gap-4 w-full max-w-md">
                      <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-black text-indigo-600">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl transition-all ${isExpanded ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"}`}
                  >
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-7 pt-2 border-t border-slate-50 space-y-3">
                        {plan.tasks?.map((task: any) => (
                          <StudentTaskLog key={task.id} task={task} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
