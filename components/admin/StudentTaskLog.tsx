"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MessageSquareText, Clock } from "lucide-react";

interface Task {
  id: string;
  dayNumber: number;
  taskDescription: string;
  isCompleted: boolean;
  quizQuestion: string;
  studentAnswer: string | null;
  completedAt: string | null;
}

export default function StudentTaskLog({ task }: { task: Task }) {
  return (
    <div
      className={`p-5 border rounded-2xl transition-all ${
        task.isCompleted
          ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
          Day {task.dayNumber}
        </span>
        {task.isCompleted && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={14} /> Completed
          </span>
        )}
      </div>

      <p className="text-sm font-semibold text-slate-800 dark:text-white leading-relaxed">
        {task.taskDescription}
      </p>

      {task.studentAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-xl space-y-2 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">
            <MessageSquareText size={14} /> Synthesis Prompt:{" "}
            {task.quizQuestion}
          </div>
          <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed italic">
            "{task.studentAnswer}"
          </p>
          {task.completedAt && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
              <Clock size={12} /> Logged:{" "}
              {new Date(task.completedAt).toLocaleString()}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
