"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Loader2, Inbox } from "lucide-react";
import AnswerQuestionModal from "./AnswerQuestionModal";

interface Question {
  id: string;
  title: string;
  description: string;
  type: "TEXT" | "MULTIPLE_CHOICE";
  options: string[];
  answers?: any[];
}

// 1. Made classId optional (?) so it works on the Main Dashboard too
interface QuestionsSectionProps {
  classId?: string;
}

export default function QuestionsSection({ classId }: QuestionsSectionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Optimized Fetch Logic
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      /**
       * If classId exists: Fetch questions for that specific class.
       * If classId is missing: Fetch all pending questions for the student.
       */
      const endpoint = classId
        ? `/api/questions?classId=${classId}`
        : "/api/questions?type=student";

      const res = await fetch(endpoint);
      const data = await res.json();

      if (Array.isArray(data)) {
        // Filter out questions that already have answers from this student
        const unanswered = data.filter(
          (q: Question) => !q.answers || q.answers.length === 0,
        );
        setQuestions(unanswered);
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswerClick = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          Gathering your assignments...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
            <MessageSquare
              className="text-indigo-600 dark:text-indigo-400"
              size={24}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {classId ? "Class Questions" : "Pending Tasks"}
            </h2>
            <p className="text-sm text-slate-500">
              {questions.length} items require your attention
            </p>
          </div>
        </div>
      </div>

      {/* --- Empty State --- */}
      {questions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl"
        >
          <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Inbox size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-900 dark:text-white font-semibold">
            All caught up!
          </p>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
            You have answered all questions available at this time.
          </p>
        </motion.div>
      ) : (
        /* --- Questions List --- */
        <div className="grid gap-5">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                    {question.type
                      ? question.type.replace("_", " ")
                      : "GENERAL"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {question.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                  {question.description}
                </p>
              </div>

              <button
                onClick={() => handleAnswerClick(question)}
                className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
              >
                Answer Now
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- The Pop-up Modal --- */}
      {selectedQuestion && (
        <AnswerQuestionModal
          question={selectedQuestion}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchQuestions}
        />
      )}
    </div>
  );
}
