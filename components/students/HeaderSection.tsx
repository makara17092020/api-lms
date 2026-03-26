// ========================
// File: app/student/dashboard/HeaderSection.tsx
// ========================
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";

interface Props {
  studyPlanCount: number;
}

export default function HeaderSection({ studyPlanCount }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 rounded-3xl px-5 py-5 md:px-8 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center bg-linear-to-br from-violet-500 to-fuchsia-500 text-white rounded-3xl shadow-inner">
          <GraduationCap size={24} strokeWidth={2.75} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Student Hub
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            Your learning dashboard
          </p>
        </div>
      </div>

      <Link
        href="/student/plans"
        className="flex items-center gap-2 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:border-violet-300 transition-colors active:scale-95"
      >
        <BookOpen size={18} />
        <span className="hidden sm:inline">All Plans</span>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 text-xs font-bold">
          {studyPlanCount}
        </span>
        <ArrowRight size={16} />
      </Link>
    </motion.header>
  );
}
