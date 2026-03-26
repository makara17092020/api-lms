// ========================
// File: components/students/LoadingSkeleton.tsx
// ========================
"use client";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 rounded-3xl px-5 py-5 md:px-8">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-3xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-56 md:w-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Button */}
        <div className="h-11 w-40 rounded-3xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>

      {/* 2. Stats Skeleton (2 cards) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stat Card 1 - Total Classes */}
        <div className="rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            </div>
            <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* Stat Card 2 - Study Plans */}
        <div className="rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              <div className="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            </div>
            <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. Active Classes Skeleton */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-8 w-52 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
        </div>

        {/* Cards Grid - Fully Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 p-6 h-77.5 flex flex-col"
            >
              {/* Live badge + progress */}
              <div className="flex justify-between">
                <div className="h-6 w-16 rounded-3xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              </div>

              {/* Class title */}
              <div className="mt-6 h-7 w-4/5 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
              {/* Instructor */}
              <div className="mt-4 h-4 w-3/5 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />

              {/* Progress bar */}
              <div className="mt-auto h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-3xl animate-pulse" />

              {/* Continue button */}
              <div className="mt-8 h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-3xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Generate Plan Form Skeleton */}
      <div className="rounded-3xl bg-linear-to-br from-slate-900 to-violet-950 p-6 md:p-10 border border-white/10">
        {/* Form Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 rounded-2xl bg-slate-300/30 dark:bg-slate-400/20 animate-pulse" />
          <div className="h-8 w-64 bg-slate-300/30 dark:bg-slate-400/20 rounded-2xl animate-pulse" />
        </div>

        <div className="space-y-8">
          {/* Experience Level */}
          <div>
            <div className="h-3 w-36 bg-slate-300/30 dark:bg-slate-400/20 rounded-xl animate-pulse mb-3" />
            <div className="flex flex-wrap md:flex-nowrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-25 h-12 bg-slate-300/30 dark:bg-slate-400/20 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <div className="h-3 w-44 bg-slate-300/30 dark:bg-slate-400/20 rounded-xl animate-pulse mb-3" />
            <div className="h-14 w-full bg-slate-300/30 dark:bg-slate-400/20 rounded-3xl animate-pulse" />
          </div>

          {/* Quick suggestions chips */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-slate-300/30 dark:bg-slate-400/20 rounded-3xl animate-pulse"
              />
            ))}
          </div>

          {/* Time per day */}
          <div>
            <div className="h-3 w-32 bg-slate-300/30 dark:bg-slate-400/20 rounded-xl animate-pulse mb-3" />
            <div className="h-14 w-full bg-slate-300/30 dark:bg-slate-400/20 rounded-3xl animate-pulse" />
          </div>

          {/* Generate Button */}
          <div className="h-14 w-full bg-slate-300/30 dark:bg-slate-400/20 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
