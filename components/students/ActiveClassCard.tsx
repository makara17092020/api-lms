"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ClassItem {
  id: string;
  className: string;
  teacher?: { name: string };
}

interface Props {
  cls: ClassItem;
  index: number;
}

export default function ActiveClassCard({ cls, index }: Props) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/student/progress/${cls.id}`);
        if (res.ok) {
          const data = await res.json();
          setProgress(data.progressPercentage);
        }
      } catch (err) {
        console.error("Progress fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (cls.id) {
      fetchProgress();
    }
  }, [cls.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-white/30 dark:border-slate-700/60 overflow-hidden"
    >
      {/* 1. Added pointer-events-none to prevent overlay click hijacking */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6">
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-3xl">
            LIVE
          </span>
          <span className="text-xs font-medium text-slate-400">
            {loading ? "—" : `${progress}%`}
          </span>
        </div>

        <h3 className="mt-6 text-xl md:text-2xl font-semibold text-gray-900 dark:text-white line-clamp-2">
          {cls.className}
        </h3>

        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <GraduationCap size={18} />
          {cls.teacher?.name ? `Prof. ${cls.teacher.name}` : "Instructor TBA"}
        </p>

        <div className="mt-8 h-2 bg-slate-200 dark:bg-slate-700 rounded-3xl overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
          />
        </div>

        {/* 2. Swapped button for Link tag with z-index to force browser click priority */}
        <Link
          href={`/student/classes/${cls.id}/questions`}
          className="relative z-50 mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-4 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
        >
          Continue Learning
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
}
