"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl"; // Import translations

interface Question {
  id: string;
  title: string;
  description: string;
  type: "TEXT" | "MULTIPLE_CHOICE";
  options: string[];
}

interface Props {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AnswerQuestionModal({
  question,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const t = useTranslations("Questions"); // Use a Questions namespace
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          answerText: answer,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setAnswer("");
        setIsSuccess(false);
      }, 1500);
    } catch (err) {
      setError(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3 text-emerald-600">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("successTitle")}
                </h3>
                <p className="text-slate-500">{t("successDescription")}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {question.title}
                    </h3>
                    <p className="text-xs text-slate-400">{t("taskLabel")}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {question.description}
                    </p>
                  </div>

                  {question.type === "MULTIPLE_CHOICE" ? (
                    <div className="space-y-3">
                      {question.options.map((option, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                            answer === option
                              ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                              : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="quiz-option"
                            value={option}
                            checked={answer === option}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      required
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={t("placeholder")}
                      className="min-h-37.5 w-full rounded-2xl border border-slate-200 p-4 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  )}

                  {error && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <div className="mt-8 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !answer}
                      className="flex-2 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                    >
                      {loading ? (
                        t("submitting")
                      ) : (
                        <>
                          {t("submitBtn")} <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
