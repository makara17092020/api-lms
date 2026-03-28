"use client";

import { Sparkles } from "lucide-react";

interface StudyPlannerHeaderProps {
  title: string;
  subtitle: string;
}

export default function StudyPlannerHeader({
  title,
  subtitle,
}: StudyPlannerHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-xl text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
        <Sparkles size={14} />
        Real-time Metrics
      </div>
    </div>
  );
}
