"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, BookOpen } from "lucide-react";
import TaskCard, { Task } from "./TaskCard";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export interface Plan {
  id: string;
  topic: string;
  duration: number;
  tasks?: Task[];
}

interface PlanCardProps {
  plan: Plan;
  onDelete: (planId: string) => Promise<void>; // CHANGED: Expects a Promise from parent
  onRefresh: () => void;
}

export default function PlanCard({ plan, onDelete, onRefresh }: PlanCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // CHANGED: Made async to bridge standard void and promise!
  const handleConfirmDelete = async () => {
    await onDelete(plan.id);
  };

  return (
    <>
      <div className="relative p-8 md:p-10 bg-white/50 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 rounded-xl">
                <BookOpen size={22} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-relaxed">
                {plan.topic}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-white/80 dark:bg-white/5 backdrop-blur-md rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-white/50 dark:border-white/10 shadow-sm leading-relaxed">
                <Calendar size={14} className="text-violet-500" />
                Duration: {plan.duration} Days
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleDeleteClick}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-2xl border border-transparent hover:border-red-200 transition-all active:scale-95"
            title="Delete Plan"
          >
            <Trash2 size={20} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.tasks?.map((task) => (
            <TaskCard key={task.id} task={task} onRefresh={onRefresh} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
            planTopic={plan.topic}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete} // Types perfectly match now!
          />
        )}
      </AnimatePresence>
    </>
  );
}
