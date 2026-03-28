"use client";

import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ClassType {
  id: string;
  className: string; // 👈 Matches your Prisma schema variable naming
}

interface StudyPlannerFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  classes: ClassType[]; // Hydrated array from parent
}

export default function StudyPlannerFilters({
  searchQuery,
  setSearchQuery,
  classes,
}: StudyPlannerFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentClassId = searchParams.get("classId") || "all";

  // 🛰️ Dispatches Next.js URL tracking shifts automatically
  const handleClassChange = (classId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (classId === "all") {
      params.delete("classId");
    } else {
      params.set("classId", classId);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm items-center">
      {/* Search Input UI */}
      <div className="relative md:col-span-2">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by student name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* 🚀 Updated Dynamic Dropdown Selection using Database IDs */}
      <div className="relative">
        <Filter
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <select
          value={currentClassId}
          onChange={(e) => handleClassChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white appearance-none cursor-pointer"
        >
          <option value="all">All Classrooms</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {" "}
              {/* Uses Prisma's Primary DB Id */}
              {cls.className}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
