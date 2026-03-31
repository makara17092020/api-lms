"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- REUSABLE ADMIN COMPONENTS ---
import StudentProfileHeader from "@/components/admin/StudentProfileHeader";
import StudentTaskLog from "@/components/admin/StudentTaskLog";

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

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
      const res = await fetch(`/api/admin/students/${studentId}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setData(json);
      if (!silent && json.studyPlans?.length > 0) {
        setExpandedPlans({ [json.studyPlans[0].id]: true });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  if (loading)
    return <div className="p-10 animate-pulse bg-slate-50 min-h-screen" />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Upper Nav */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft size={16} /> Back to Table
        </button>
        <button
          onClick={() => {
            setIsRefreshing(true);
            fetchStudentData(true);
          }}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm active:scale-95 transition-all"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />{" "}
          Sync Progress
        </button>
      </div>

      {/* Header Section Component */}
      <StudentProfileHeader data={data} />

      {/* Plans Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
          <BookOpen size={20} className="text-indigo-500" /> Curriculum Roadmap
        </h2>

        {data.studyPlans?.map((plan: any) => {
          const isExpanded = expandedPlans[plan.id];
          const progress = Math.round(
            (plan.tasks.filter((t: any) => t.isCompleted).length /
              plan.tasks.length) *
              100,
          );

          return (
            <div
              key={plan.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-4xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setExpandedPlans((prev) => ({
                    ...prev,
                    [plan.id]: !prev[plan.id],
                  }))
                }
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex-1 text-left space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {plan.topic}
                  </h3>
                  <div className="flex items-center gap-3 w-full max-w-xs">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <div
                        style={{ width: `${progress}%` }}
                        className="h-full bg-indigo-500 transition-all duration-700"
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  {isExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
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
                    <div className="p-6 pt-0 border-t border-slate-50 dark:border-slate-800 space-y-4">
                      {plan.tasks.map((task: any) => (
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
  );
}
