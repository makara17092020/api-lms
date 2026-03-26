"use client";

import { User, Mail, School } from "lucide-react";

interface StudentProfileHeaderProps {
  data: {
    name: string;
    email: string;
    image: string | null;
    class?: { className: string };
  };
}

export default function StudentProfileHeader({
  data,
}: StudentProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm transition-all">
      <div className="flex items-center gap-4">
        {data.image ? (
          <img
            src={data.image}
            alt={data.name}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-900/20"
          />
        ) : (
          <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xl flex items-center justify-center rounded-full">
            {data.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User size={18} className="text-slate-400" /> {data.name}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
            <Mail size={14} /> {data.email}
          </p>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end">
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
          <School size={16} />
          <span className="text-sm font-bold uppercase tracking-tight">
            {data.class?.className || "No Class Assigned"}
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 mt-1 mr-2 uppercase tracking-widest">
          Classroom Path
        </span>
      </div>
    </div>
  );
}
