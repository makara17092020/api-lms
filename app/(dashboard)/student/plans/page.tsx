"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PlanCard, { Plan } from "@/components/plans/PlanCard";
import SkeletonCard from "@/components/plans/SkeletonCard";

export default function StudentPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/ai/plans");
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      setPlans([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // ✅ FIXED: Removed browser `confirm()` since the custom modal handles it now!
  const handleDeletePlan = async (planId: string) => {
    try {
      const res = await fetch(`/api/ai/plans/${planId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      // Update UI state immediately after DB success
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete plan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/90 transition-all shadow-sm hover:-translate-x-1"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
            <Sparkles size={18} />
            <span className="text-sm font-bold tracking-wider uppercase">
              Active Plans
            </span>
          </div>
        </div>

        {/* Dynamic State Rendering with Animations */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {[1, 2].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : plans.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-16 text-center bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-xl"
            >
              <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-full w-fit mx-auto mb-4">
                <Sparkles size={32} className="text-slate-400" />
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">
                No active plans generated yet.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Head over to the Dashboard to create one!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="space-y-12"
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <PlanCard
                    plan={plan}
                    onDelete={handleDeletePlan}
                    onRefresh={fetchPlans}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
