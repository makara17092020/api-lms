"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  Sparkles,
  Loader2,
  Send,
} from "lucide-react";

export interface Task {
  id: string;
  dayNumber: number;
  taskDescription: string;
  isCompleted: boolean;
}

interface TaskCardProps {
  task: Task;
  onRefresh: () => void; // To refresh state after answering
}

export default function TaskCard({ task, onRefresh }: TaskCardProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuiz = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);

      setTimeout(() => {
        setIsQuizOpen(false);
        setAnswer("");
        setSubmitted(false);
        onRefresh(); // Parent updates ui to show green tick
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving your answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col justify-between p-6 h-fit rounded-4xl border transition-all duration-300 backdrop-blur-xl ${
        task.isCompleted
          ? "bg-emerald-500/3 border-emerald-500/20 dark:border-emerald-500/10 shadow-lg"
          : isQuizOpen
            ? "bg-white dark:bg-slate-900 border-violet-500 dark:border-violet-400 shadow-2xl"
            : "bg-white/70 dark:bg-white/5 border-white/40 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-xl"
      }`}
    >
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          {/* Day Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-colors ${
                task.isCompleted
                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                  : "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300"
              }`}
            >
              Day {task.dayNumber}
            </div>

            {isQuizOpen && (
              <span className="flex items-center gap-1 text-xs font-semibold text-fuchsia-500 dark:text-fuchsia-400 animate-pulse">
                <Sparkles size={12} /> Quiz Active
              </span>
            )}
          </div>

          {/* Status Icon */}
          <motion.div className="shrink-0">
            {task.isCompleted ? (
              <CheckCircle2
                size={26}
                className="text-emerald-500 dark:text-emerald-400"
              />
            ) : (
              <Circle
                size={26}
                className="text-slate-300 dark:text-slate-600"
              />
            )}
          </motion.div>
        </div>

        {/* Task Description */}
        <p
          className={`text-base leading-relaxed font-medium transition-all duration-300 whitespace-pre-line ${
            task.isCompleted
              ? "text-slate-400 dark:text-slate-500 line-through opacity-70"
              : "text-slate-800 dark:text-white"
          }`}
        >
          {task.taskDescription}
        </p>
      </div>

      {/*ACTION BUTTON (Toggle the Quiz) */}
      {!task.isCompleted && !isQuizOpen && (
        <div className="mt-6">
          <motion.button
            onClick={() => setIsQuizOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-2xl transition-all shadow-md bg-linear-to-r from-violet-500 to-indigo-500 text-white hover:brightness-110"
          >
            <HelpCircle size={16} className="shrink-0" />
            Mark as Done
          </motion.button>
        </div>
      )}

      {/*POP-UP FORM INLINE (Renders right inside the card!) */}
      <AnimatePresence>
        {isQuizOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            className="mt-6 overflow-hidden"
          >
            {!submitted ? (
              <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    Quick Verification Quiz
                  </h4>
                  <button
                    onClick={() => setIsQuizOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Explain what you learned from this task:
                </p>

                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={3}
                  placeholder="Type your synthesis for the teacher..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/20 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none shadow-sm"
                />

                <motion.button
                  onClick={handleSubmitQuiz}
                  disabled={loading || !answer.trim()}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-11 flex items-center justify-center gap-2 bg-linear-to-r from-fuchsia-500 to-pink-500 text-white font-semibold rounded-xl text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Submit Answer to Teacher
                </motion.button>
              </div>
            ) : (
              // Inside-card mini success visual
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 flex flex-col items-center justify-center bg-emerald-500/5 border border-emerald-500/20 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ease: "easeInOut", duration: 0.3 }}
                  className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-3"
                >
                  <CheckCircle2
                    size={32}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                </motion.div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Saved Successfully!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Completing task node...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
