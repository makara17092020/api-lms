"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl"; // 1. Added import

interface Props {
  totalClasses: number;
  studyPlanCount: number;
}

export default function StatsSection({ totalClasses, studyPlanCount }: Props) {
  const t = useTranslations("Dashboard"); // 2. Initialized translations

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Total Classes Card */}
      <motion.div
        whileHover={{ y: -3 }}
        className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("totalClassesLabel")}
            </p>
            <p className="mt-1 text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tabular-nums">
              {totalClasses}
            </p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-linear-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
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
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("studyPlansLabel")}
            </p>
            <p className="mt-1 text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tabular-nums">
              {studyPlanCount}
            </p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-linear-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20">
            <Sparkles size={24} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
