"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import LoadingSkeleton from "@/components/study-planner/LoadingSkeleton";

export default function StudentPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  useEffect(() => {
    fetchPlans();

    // 📡 1. Listen for the Sidebar's manual visual refresh pulse
    const handleRefreshEvent = () => {
      setLoading(true); // Toggle skeleton on
      fetchPlans();
    };

    window.addEventListener("trigger-dashboard-refresh", handleRefreshEvent);

    return () => {
      window.removeEventListener(
        "trigger-dashboard-refresh",
        handleRefreshEvent,
      );
    };
  }, []);

  // inside StudentPlansPage.tsx

  const fetchPlans = async () => {
    try {
      // 🚀 Uses our secure interceptor that handles 401 triggers!
      const res = await fetch("/api/ai/plans");

      if (res.status === 401) {
        console.warn("Token expired, attempting refresh context...");
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });

        if (refreshRes.ok) {
          // Retry original call!
          const retryRes = await fetch("/api/ai/plans");
          const data = await retryRes.json();
          setPlans(Array.isArray(data) ? data : []);
          return;
        } else {
          window.location.href = "/login";
        }
      }

      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this study plan? Progress is irreversible!",
      )
    )
      return;

    try {
      const res = await fetch(`/api/ai/plans/${planId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete plan. Please try again.");
    }
  };

  // 🚦 Show pulse skeleton viewport if loading or refreshing
  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/90 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {plans.length === 0 ? (
          <div className="p-10 text-center bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20">
            <p className="text-gray-500 font-medium">
              No active plans generated yet.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-lg"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Topic: {plan.topic}
                    </h2>
                    <span className="mt-2 inline-block px-4 py-2 bg-white/60 dark:bg-white/10 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-300 border border-white/40">
                      Duration: {plan.duration} Days
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl border border-transparent hover:border-red-200 transition-all active:scale-95"
                    title="Delete Plan"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plan.tasks?.map((task: any) => (
                    <div key={task.id} className="flex flex-col h-fit">
                      <div className="flex items-start gap-4 p-5 bg-white/80 dark:bg-white/10 rounded-2xl border border-white/30 h-full">
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300 rounded-xl font-bold text-xs h-fit">
                          Day {task.dayNumber}
                        </div>
                        <div className="flex-1 space-y-3">
                          <p
                            className={`text-gray-800 dark:text-gray-200 font-medium whitespace-pre-line ${task.isCompleted ? "line-through opacity-50" : ""}`}
                          >
                            {task.taskDescription}
                          </p>
                          {!task.isCompleted && (
                            <button
                              onClick={() =>
                                setActiveTaskId(
                                  activeTaskId === task.id ? null : task.id,
                                )
                              }
                              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                            >
                              <HelpCircle size={14} /> Mark as Done
                            </button>
                          )}
                        </div>
                        {task.isCompleted ? (
                          <CheckCircle2
                            size={24}
                            className="text-emerald-500 shrink-0"
                          />
                        ) : (
                          <Circle
                            size={24}
                            className="text-gray-400 shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
