// ========================
// File: app/student/dashboard/ActiveClassCard.tsx
// ========================
"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassItem {
  id: string;
  className: string;
  teacher?: { name: string };
}

interface Props {
  cls: ClassItem;
  index: number;
  router: ReturnType<typeof useRouter>;
}

export default function ActiveClassCard({ cls, index, router }: Props) {
  // Mock progress for demo (real app would come from API)
  const progress = 65 + (index % 3) * 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-slate-700/60 overflow-hidden"
    >
      {/* Light gradient glow */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6">
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-3xl">
            LIVE
          </span>
          <span className="text-xs font-medium text-slate-400">
            {progress}%
          </span>
        </div>

        <h3 className="mt-6 text-xl md:text-2xl font-semibold text-gray-900 dark:text-white line-clamp-2">
          {cls.className}
        </h3>

        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <GraduationCap size={18} />
          {cls.teacher?.name ? `Prof. ${cls.teacher.name}` : "Instructor TBA"}
        </p>

        {/* Progress bar */}
        <div className="mt-8 h-2 bg-slate-200 dark:bg-slate-700 rounded-3xl overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-linear-to-r from-violet-400 to-fuchsia-400"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(`/student/classes/${cls.id}`)}
          className="mt-8 w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold bg-linear-to-r from-violet-500 to-fuchsia-500 text-white rounded-3xl active:scale-95"
        >
          Continue Learning
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
