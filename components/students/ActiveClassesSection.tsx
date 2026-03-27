"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import ActiveClassCard from "./ActiveClassCard";

interface ClassItem {
  id: string;
  className: string;
  teacher?: { name: string };
}

interface Props {
  classes: ClassItem[];
  loading: boolean;
  // ❌ Removed router from interface
}

export default function ActiveClassesSection({ classes, loading }: Props) {
  // ❌ Removed router from destructuring
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/40">
            <BookOpen
              className="text-violet-600 dark:text-violet-400"
              size={22}
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Active Classes
          </h2>
        </div>

        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold shadow-md">
          {classes.length} Classes
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-3xl bg-white/50 dark:bg-slate-900/50 animate-pulse border border-white/20 dark:border-slate-700/40 backdrop-blur"
            />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700/40 p-14 text-center backdrop-blur"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
              <BookOpen className="text-slate-400" size={28} />
            </div>
          </div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            No active classes
          </p>
          <p className="text-sm mt-2 text-slate-400">
            Start learning by joining a class 🚀
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* ✅ FIXED: No more router prop passed here */}
              <ActiveClassCard cls={cls} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
