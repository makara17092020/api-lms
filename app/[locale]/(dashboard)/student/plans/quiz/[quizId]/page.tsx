"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Trophy } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizData {
  id: string;
  title: string;
  questions: Question[];
}

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/ai/quiz/${quizId}`);
        if (!res.ok) throw new Error("Quiz not found");
        const data = await res.json();
        setQuiz(data);
      } catch (err) {
        alert("Could not load quiz. Please try again.");
        router.push("/student/plans");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, router]);

  // Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [quiz!.questions[currentQuestionIndex].id]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const submitQuiz = () => {
    if (!quiz) return;
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setIsSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-xl font-medium">Loading your quiz...</div>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/student/plans")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Plans</span>
          </button>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-3xl shadow-sm">
            <Clock size={18} className="text-amber-500" />
            <span className="font-mono text-xl font-semibold">
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-violet-600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-slate-500">{quiz.title}</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-2 bg-linear-to-r from-violet-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-8 leading-tight">
                  {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, i) => {
                    const isSelected =
                      selectedAnswers[currentQuestion.id] === option;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(option)}
                        className={`p-6 text-left rounded-2xl border-2 transition-all text-lg ${
                          isSelected
                            ? "border-violet-600 bg-violet-50 dark:bg-violet-900/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-violet-300"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-12">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="px-8 py-4 text-slate-500 disabled:opacity-30"
                  >
                    ← Previous
                  </button>

                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl flex items-center gap-2"
                    >
                      <Trophy size={20} />
                      Finish Quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-2xl"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Results Screen */
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-6">
                  <Trophy size={48} className="text-emerald-600" />
                </div>

                <h2 className="text-4xl font-bold mb-2">Your Score</h2>
                <div className="text-6xl font-bold text-emerald-600 mb-8">
                  {score} / {quiz.questions.length}
                </div>

                <div className="space-y-6 text-left max-w-md mx-auto">
                  {quiz.questions.map((q, i) => {
                    const userAnswer = selectedAnswers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                      <div key={i} className="flex gap-4">
                        {isCorrect ? (
                          <CheckCircle2
                            className="text-emerald-500 mt-1"
                            size={22}
                          />
                        ) : (
                          <XCircle className="text-red-500 mt-1" size={22} />
                        )}
                        <div>
                          <p className="font-medium">{q.question}</p>
                          <p className="text-sm mt-1">
                            Your answer:{" "}
                            <span
                              className={
                                isCorrect ? "text-emerald-600" : "text-red-500"
                              }
                            >
                              {userAnswer || "Not answered"}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-emerald-600">
                              Correct: {q.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 flex gap-4 justify-center">
                  <button
                    onClick={() => router.push("/student/plans")}
                    className="px-8 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl font-medium"
                  >
                    Back to Study Plans
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-violet-600 text-white rounded-2xl font-medium"
                  >
                    Retake Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
