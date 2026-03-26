// ========================
// File: app/student/dashboard/StatsSection.tsx
// ========================
"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";

interface Props {
  totalClasses: number;
  studyPlanCount: number;
}

export default function StatsSection({ totalClasses, studyPlanCount }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Total Classes Card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-500 dark:text-slate-400">
              TOTAL CLASSES
            </p>
            <p className="mt-1 text-4xl font-semibold text-gray-900 dark:text-white tabular-nums">
              {totalClasses}
            </p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
        </div>
      </motion.div>

      {/* Study Plans Card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-500 dark:text-slate-400">
              STUDY PLANS
            </p>
            <p className="mt-1 text-4xl font-semibold text-gray-900 dark:text-white tabular-nums">
              {studyPlanCount}
            </p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-linear-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
