"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2 } from "lucide-react";

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
  const [question, setQuestion] = useState(
    "Explain the core principle behind this task in your own words.",
  );
  const [answer, setAnswer] = useState("");

  const handleSubmitQuiz = async () => {
    setLoading(true);
    try {
      // ✅ POST to endpoint evaluating student synthesis
      await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      onComplete();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-xl p-8 rounded-[2.5rem] shadow-2xl z-10 border border-white/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verify Day Objective
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
          >
            <X />
          </button>
        </div>

        <div className="p-4 bg-violet-50 dark:bg-violet-900/30 rounded-2xl mb-6">
          <p className="text-xs font-bold text-violet-600 dark:text-violet-300 mb-1">
            Task Context
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {taskDescription}
          </p>
        </div>

        <p className="text-md font-semibold text-gray-900 dark:text-white mb-3">
          Critical Question: {question}
        </p>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          placeholder="Type your synthesis here..."
          className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />

        <button
          onClick={handleSubmitQuiz}
          disabled={loading || !answer.trim()}
          className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <CheckCircle2 size={20} />
          )}
          Submit Answer & Complete Task
        </button>
      </motion.div>
    </div>
  );
}
