"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Mail,
  User,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageSquareText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  taskDescription: string;
  quizQuestion: string;
  studentAnswer: string | null;
  dayNumber: number;
  isCompleted: boolean;
  completedAt: string | null;
}

interface StudyPlan {
  id: string;
  topic: string;
  createdAt: string;
  tasks: Task[];
}

interface StudentProfileData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  studyPlans: StudyPlan[];
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();

  const studentId = params?.id as string;

  const [data, setData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 📂 Tracking which Study Plan accordion is currently expanded
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>(
    {},
  );

  const togglePlan = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const fetchStudentData = async (silent = false) => {
    if (!studentId) return;

    try {
      if (!silent) setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/students/${studentId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Student profile not found.");
        if (res.status === 401 || res.status === 403)
          throw new Error("Unauthorized to view this profile.");
        throw new Error("Failed to fetch student profile.");
      }

      const json = await res.json();
      setData(json);

      // Auto-expand the first plan if available on initial load
      if (!silent && json.studyPlans?.length > 0) {
        setExpandedPlans({ [json.studyPlans[0].id]: true });
      }
    } catch (err: any) {
      console.error("Failed to fetch student data:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchStudentData(true);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" />
        <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-red-500 font-medium">
          {error || "Student profile not found."}
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-semibold rounded-xl text-slate-800 dark:text-white transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* 🏁 Upper Navigation Bar */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Students Table
        </button>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 transition-all text-slate-600 dark:text-slate-400"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          Sync Data
        </button>
      </div>

      {/* 👤 Student Summary Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
        {data.image ? (
          <img
            src={data.image}
            alt={data.name || "Student profile image"}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-900/30"
          />
        ) : (
          <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xl flex items-center justify-center rounded-full">
            {data.name ? data.name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User size={18} className="text-slate-400" /> {data.name}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <Mail size={14} /> {data.email}
          </p>
        </div>
      </div>

      {/* 📂 Consolidated Study Plans & In-Context Answers */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-500" /> Dynamic Course
          Progress Tracking
        </h2>

        {data.studyPlans?.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center text-sm text-slate-400">
            No study plans created yet for this student.
          </div>
        ) : (
          data.studyPlans.map((plan) => {
            const isExpanded = expandedPlans[plan.id];
            const completedCount = plan.tasks.filter(
              (t) => t.isCompleted,
            ).length;
            const progressPercentage =
              plan.tasks.length === 0
                ? 0
                : Math.round((completedCount / plan.tasks.length) * 100);

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm"
              >
                {/* 🏷️ Plan Accordion Header Clickable */}
                <button
                  onClick={() => togglePlan(plan.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-2 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {plan.topic || "Topic Unnamed Plan"}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md font-medium">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Progress Bar in Header */}
                    <div className="flex items-center gap-3 w-full max-w-sm">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${progressPercentage}%` }}
                          className="h-full bg-linear-to-r from-indigo-500 to-fuchsia-500 rounded-full transition-all duration-500"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {completedCount}/{plan.tasks.length} Paths
                      </span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                {/* 📉 Dropping list animation using Framer Motion */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 200,
                      }}
                    >
                      <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          {plan.tasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-5 border rounded-2xl transition-all ${
                                task.isCompleted
                                  ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                                      Day {task.dayNumber}
                                    </span>
                                    {task.isCompleted && (
                                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 size={14} /> Completion
                                        Point Logged
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">
                                    {task.taskDescription}
                                  </p>
                                </div>
                              </div>

                              {/* 📝 If Task is complete & student provided an answer, reveal answer inside the task card */}
                              {task.studentAnswer && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4 p-4 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-xl space-y-2 shadow-sm"
                                >
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">
                                    <MessageSquareText size={14} /> Synthesis
                                    Objective Prompt
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 italic font-medium">
                                    "{task.quizQuestion}"
                                  </p>
                                  <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />
                                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                                    {task.studentAnswer}
                                  </p>

                                  {task.completedAt && (
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                                      <Clock size={12} /> Sync Logged:{" "}
                                      {new Date(
                                        task.completedAt,
                                      ).toLocaleString()}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
