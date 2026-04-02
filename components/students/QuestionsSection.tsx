"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";

interface Question {
  id: string;
  title: string;
  description: string;
  type: "TEXT" | "MULTIPLE_CHOICE";
  options: string[];
  answers?: Array<{
    id: string;
    answerText: string;
    student: { name: string; email: string };
  }>;
}

interface AnswerQuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AnswerQuestionModal({ question, isOpen, onClose, onSuccess }: AnswerQuestionModalProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id, answerText: answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      onSuccess();
      onClose();
      setAnswer("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{question.title}</h3>
          <p className="text-gray-600 mb-6">{question.description}</p>

          <form onSubmit={handleSubmit}>
            {question.type === "MULTIPLE_CHOICE" ? (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="text-blue-600"
                      required
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your answer..."
                rows={6}
                required
              />
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mt-4">
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Answer"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function QuestionsSection() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Get student's classes first
      const classRes = await fetch("/api/classes?type=student");
      const classes = await classRes.json();

      if (Array.isArray(classes) && classes.length > 0) {
        // Fetch questions for each class
        const questionsPromises = classes.map((cls: any) =>
          fetch(`/api/questions?classId=${cls.id}`).then(res => res.json())
        );
        const questionsArrays = await Promise.all(questionsPromises);
        const allQuestions = questionsArrays.flat();

        // Filter out questions already answered (answers array will have entries if answered)
        const unansweredQuestions = allQuestions.filter((q: Question) =>
          !q.answers || q.answers.length === 0
        );

        setQuestions(unansweredQuestions);
      }
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No questions available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
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
                <button
                  onClick={() => handleAnswer(question)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  Answer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnswerQuestionModal
        question={selectedQuestion!}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}