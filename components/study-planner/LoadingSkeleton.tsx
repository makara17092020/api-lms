"use client";

import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-gray-200 dark:bg-white/10 rounded-3xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Big Layout Shimmer Grid */}
        <div className="space-y-12">
          {/* Active Class Section Title */}
          <div className="h-7 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="h-52 p-8 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
                  <div className="h-7 w-40 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
                  <div className="h-4 w-52 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
                </div>
                <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Prompt Generator Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-96 p-10 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
                <div className="h-16 w-full bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse" />
                <div className="h-16 w-full bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse" />
              </div>
              <div className="h-14 w-full bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
