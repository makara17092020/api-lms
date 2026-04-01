"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Loader2,
  Send,
  ArrowRight,
  BookOpen,
  Target,
} from "lucide-react";

export interface Task {
  id: string;
  dayNumber: number;
  taskDescription: string;
  isCompleted: boolean;
  studentAnswer?: string | null;
}

interface TaskCardProps {
  task: Task;
  planId: string;
  index: number; // Added index to handle sequential numbering
  onRefresh: () => void;
}

export default function TaskCard({
  task,
  planId,
  index,
  onRefresh,
}: TaskCardProps) {
  const router = useRouter();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- CALCULATE DISPLAY DAY ---
  // Uses task.dayNumber if valid (> 0), otherwise falls back to index + 1
  const displayDay = task.dayNumber > 0 ? task.dayNumber : index + 1;
  const formattedDay = displayDay.toString().padStart(2, "0");

  // --- CONTENT PARSER ---
  const structuredContent = useMemo(() => {
    // Split by new lines and clean up whitespace
    const lines = task.taskDescription
      .split("\n")
      .map((l) => l.trim())
      .filter((line) => line !== "");

    // Regex to detect bullets (•, -, *, 1., etc.)
    const bulletRegex = /^[•\-\*\d+\.]\s*/;

    let title = "";
    let bulletLines = lines;

    // If the first line exists and DOES NOT start with a bullet, it's a title
    if (lines.length > 0 && !bulletRegex.test(lines[0])) {
      title = lines[0];
      bulletLines = lines.slice(1);
    }

    // Strip the bullet characters from the remaining lines
    const cleanBullets = bulletLines.map((b) => b.replace(bulletRegex, ""));

    return { title, bullets: cleanBullets };
  }, [task.taskDescription]);

  const handleSubmitVerification = async () => {
    if (!answer.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/tasks/${task.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) throw new Error("Failed to save progress");

      setSubmitted(true);
      setTimeout(() => {
        setIsQuizOpen(false);
        setAnswer("");
        setSubmitted(false);
        onRefresh();
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeQuiz = async () => {
    setQuizLoading(true);

    try {
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: planId,
          planContent: `Focus Topic: ${task.taskDescription}. Student Mastery Note: ${task.studentAnswer}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      router.push(`/student/plans/quiz/${data.quizId}`);
    } catch (err: any) {
      alert("Failed to start quiz: " + err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <motion.div
      layout
      className={`relative flex flex-col group p-8 md:p-10 rounded-[3rem] border transition-all duration-500 ${
        task.isCompleted
          ? "bg-emerald-50/40 dark:bg-emerald-500/5 border-emerald-200/50 dark:border-emerald-500/10 shadow-sm"
          : isQuizOpen
            ? "bg-white dark:bg-slate-900 border-violet-500 ring-8 ring-violet-500/5 shadow-2xl z-10"
            : "bg-white/90 dark:bg-slate-900/60 border-slate-200 dark:border-white/5 backdrop-blur-xl hover:border-violet-300 dark:hover:border-violet-500/40 hover:shadow-2xl"
      }`}
    >
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-2xl font-black text-xl shadow-lg transition-all duration-500 ${
                  task.isCompleted
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-violet-600/20"
                }`}
              >
                {formattedDay}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Timeline
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Day {displayDay}
              </span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {task.isCompleted ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  Mastered
                </span>
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
            ) : (
              <Circle
                size={28}
                className="text-slate-200 dark:text-slate-700 group-hover:text-violet-400 transition-colors"
              />
            )}
          </motion.div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          {structuredContent.title && (
            <h3
              className={`text-2xl font-black tracking-tight leading-[1.3] ${
                task.isCompleted
                  ? "text-slate-400 line-through opacity-60"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {structuredContent.title}
            </h3>
          )}

          <ul className="space-y-5">
            {structuredContent.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-4 group/item">
                <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 shrink-0 group-hover/item:bg-violet-500 transition-colors">
                  <Target
                    size={12}
                    className="text-violet-600 dark:text-violet-400 group-hover/item:text-white"
                  />
                </div>
                <span
                  className={`text-[15px] leading-relaxed font-semibold ${
                    task.isCompleted
                      ? "text-slate-400 line-through opacity-50"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-10">
        {!task.isCompleted && !isQuizOpen && (
          <motion.button
            onClick={() => setIsQuizOpen(true)}
            whileHover={{ scale: 1.02, y: -4 }}
            className="w-full py-5 px-6 flex items-center justify-center gap-3 text-sm font-black rounded-3xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-2xl transition-all"
          >
            <BookOpen size={18} />
            COMPLETE MODULE
          </motion.button>
        )}

        <AnimatePresence>
          {isQuizOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              {!submitted ? (
                <div className="p-6 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-fuchsia-500" />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                        Reflective Summary
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsQuizOpen(false)}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500"
                    >
                      CANCEL
                    </button>
                  </div>

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={3}
                    placeholder="Briefly explain the key concepts you mastered..."
                    className="w-full px-5 py-4 bg-white dark:bg-slate-950 border-none rounded-2xl text-sm outline-none shadow-sm"
                  />

                  <button
                    onClick={handleSubmitVerification}
                    disabled={loading || !answer.trim()}
                    className="w-full h-14 flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-700 text-white font-black rounded-2xl text-xs tracking-widest shadow-xl"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    VERIFY LEARNING
                  </button>
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] text-center">
                  <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                  <p className="text-lg font-black text-emerald-600 uppercase tracking-tight">
                    Day Validated
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {task.isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <button
              onClick={handleTakeQuiz}
              disabled={quizLoading}
              className="w-full py-5 bg-linear-to-br from-fuchsia-600 to-pink-600 text-white font-black rounded-3xl text-sm flex items-center justify-center gap-3 hover:shadow-fuchsia-500/40 hover:shadow-2xl transition-all group"
            >
              {quizLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={20} />
                  START PRACTICE QUIZ
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1.5 transition-transform"
                  />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
