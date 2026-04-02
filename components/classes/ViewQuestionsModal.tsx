"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, MessageSquare, Users, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  title: string;
  description: string;
  type: "TEXT" | "MULTIPLE_CHOICE";
  options: string[];
  answers: Array<{
    id: string;
    answerText: string;
    student: { name: string; email: string };
  }>;
}

interface ViewQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
}

export default function ViewQuestionsModal({
  isOpen,
  onClose,
  classId,
}: ViewQuestionsModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && classId) {
      fetchQuestions();
    }
  }, [isOpen, classId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions?classId=${classId}`);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Class Questions</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No questions created yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-2xl p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.title}</h3>
                    <p className="text-gray-600 mb-3">{question.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        {question.type === "MULTIPLE_CHOICE" ? "Multiple Choice" : "Text Answer"}
                      </span>
                      {question.type === "MULTIPLE_CHOICE" && (
                        <span>{question.options.length} options</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Users size={18} />
                      Student Answers ({question.answers.length})
                    </h4>

                    {question.answers.length === 0 ? (
                      <p className="text-gray-500 text-sm">No answers yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-gray-900">{answer.student.name}</div>
                              <div className="text-xs text-gray-500">{answer.student.email}</div>
                            </div>
                            <div className="text-gray-700">
                              {question.type === "MULTIPLE_CHOICE" ? (
                                <span className="inline-flex items-center gap-2">
                                  <CheckCircle size={16} className="text-green-600" />
                                  {answer.answerText}
                                </span>
                              ) : (
                                <p className="text-sm">{answer.answerText}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}