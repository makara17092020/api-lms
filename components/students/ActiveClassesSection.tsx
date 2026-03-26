// ========================
// File: app/student/dashboard/ActiveClassesSection.tsx
// ========================
"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import ActiveClassCard from "./ActiveClassCard";
import { useRouter } from "next/navigation";

interface ClassItem {
  id: string;
  className: string;
  teacher?: { name: string };
}

interface Props {
  classes: ClassItem[];
  loading: boolean;
  router: ReturnType<typeof useRouter>;
}

export default function ActiveClassesSection({
  classes,
  loading,
  router,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="text-violet-500" size={26} />
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Active Classes{" "}
          <span className="text-slate-400 dark:text-slate-500">
            ({classes.length})
          </span>
        </h2>
      </div>

      {loading ? (
        // Simple skeleton - mobile friendly
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-3xl bg-white/60 dark:bg-slate-900/60 animate-pulse border border-white/30 dark:border-slate-700/40"
            />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700/40 p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No active classes yet.
          </p>
          <p className="text-sm mt-2 text-slate-400">
            Browse courses to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, index) => (
            <ActiveClassCard
              key={cls.id}
              cls={cls}
              index={index}
              router={router}
            />
          ))}
        </div>
      )}
    </div>
  );
}
