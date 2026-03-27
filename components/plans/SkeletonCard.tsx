"use client";

import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <div className="relative p-8 md:p-10 bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 dark:border-white/10 shadow-xl overflow-hidden h-fit">
      {/* Smooth moving shimmer gradient (prevents boring blinking) */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 -z-10 bg-linear-to-r from-transparent via-white/20 dark:via-white/5 to-transparent pointer-events-none"
      />

      {/*Header Skeleton (Matches "Sing" + Duration + Delete Bin) */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 animate-pulse">
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-3">
            {/* Topic Icon Box */}
            <div className="h-11 w-11 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
            {/* Title text */}
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
          </div>

          {/* Duration Badge */}
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-2xl w-32 ml-14" />
        </div>

        {/* Delete button bin */}
        <div className="h-11 w-11 bg-slate-200 dark:bg-slate-800 rounded-2xl shrink-0 self-end md:self-auto" />
      </div>

      {/* Nested Micro-Grid Tasks (Matches Day 1 - Day 4 setup) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-60 justify-between p-6 rounded-4xl border bg-white/70 dark:bg-white/5 border-white/40 dark:border-white/10"
          >
            <div className="space-y-5 h-full">
              <div className="flex items-start justify-between gap-4">
                {/* Day Badge */}
                <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                {/* Circle Checkbox Status */}
                <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>

              {/* Multiline Text Descriptions (Matches your screenshot content) */}
              <div className="space-y-2.5 mt-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-11/12" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-5/6" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
              </div>
            </div>

            {/* "Mark as Done" / Action Button Bottom Skeleton */}
            <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
