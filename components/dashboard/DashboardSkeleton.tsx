"use client";

export default function DashboardSkeleton() {
  return (
    <div className="relative min-h-screen p-6 md:p-10 bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Skeleton pulses */}
        <header className="space-y-3">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-5 w-96 bg-gray-100 animate-pulse rounded-xl" />
        </header>

        {/* Isometric Stat Card Grids Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-8 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between h-64"
            >
              <div className="h-14 w-14 bg-gray-200 animate-pulse rounded-3xl" />
              <div className="space-y-3 mt-auto">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded-md" />
                <div className="h-12 w-20 bg-gray-300 animate-pulse rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Deep Graph Chart Pulse Canvas */}
        <div className="h-96 w-full bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white/50 p-8 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-4 w-64 bg-gray-100 animate-pulse rounded-md" />
            </div>
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-xl" />
          </div>
          <div className="h-64 w-full bg-gray-100 animate-pulse rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
