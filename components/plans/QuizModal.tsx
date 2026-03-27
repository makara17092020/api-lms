"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, Sparkles, BookOpen } from "lucide-react";

interface QuizModalProps {
  taskDescription: string;
  taskId: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function QuizModal({
  taskDescription,
  taskId,
  onClose,
  onComplete,
}: QuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answer, setAnswer] = useState("");

  const question =
    "Explain the core principle behind this task in your own words.";

  const handleSubmitQuiz = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    try {
      // This hits your API and saves the answer in the database using Prisma!
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);

      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500); // Wait for the success checkmark animation to finish
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving your answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Blur Glassmorphism Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl z-10 border border-white/20 dark:border-slate-800/60 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-violet-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 -z-10 h-32 w-32 bg-fuchsia-500/10 blur-3xl rounded-full" />

          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 dark:bg-violet-900/50 rounded-2xl text-violet-600 dark:text-violet-400">
                <Sparkles size={22} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Verify Objective
              </h2>
            </div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Task Context Banner */}
                <div className="p-5 bg-violet-500/5 dark:bg-violet-400/10 border border-violet-200/50 dark:border-violet-500/20 rounded-2xl mb-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen
                      size={16}
                      className="text-violet-600 dark:text-violet-400"
                    />
                    <p className="text-xs font-bold tracking-widest uppercase text-violet-600 dark:text-violet-400">
                      Task Context
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {taskDescription}
                  </p>
                </div>

                {/* Question Display */}
                <p className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  Critical Question:{" "}
                  <span className="font-normal text-gray-700 dark:text-gray-300">
                    {question}
                  </span>
                </p>

                {/* Floating TextArea Input with soft Glow */}
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                  placeholder="Type your answer here for the teacher to see..."
                  className="w-full px-5 py-4 bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl mb-6 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-800 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 dark:focus:border-violet-400 transition-all shadow-sm focus:shadow-[0_0_15px_rgba(167,139,250,0.2)] resize-none"
                />

                {/* Submit Button */}
                <motion.button
                  whileHover={!loading && answer.trim() ? { scale: 1.01 } : {}}
                  whileTap={!loading && answer.trim() ? { scale: 0.98 } : {}}
                  onClick={handleSubmitQuiz}
                  disabled={loading || !answer.trim()}
                  className="w-full h-14 bg-linear-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-3xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Saving answer...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Submit Answer & Complete Task
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              // Success Visual Checkmark Popup
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="p-4 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-4"
                >
                  <CheckCircle2
                    size={48}
                    className="text-emerald-500 dark:text-emerald-400"
                  />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Success!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your task has been successfully validated and sent to your
                  teacher.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
