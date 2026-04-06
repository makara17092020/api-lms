"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Users, CheckCircle, Edit2, Trash2, MoreVertical, Layout } from "lucide-react";
import EditQuestionModal from "./EditQuestionModal";

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
  
  // State for Editing
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question? This will also delete all student answers.")) return;
    
    try {
      const res = await fetch(`/api/questions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchQuestions(); // Refresh list after delete
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Layout className="text-blue-600" size={24} />
                Class Questions
              </h2>
              <p className="text-sm text-gray-500">View and manage student engagement</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Fetching questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No questions created yet.</p>
              </div>
            ) : (
              <AnimatePresence>
                {questions.map((question) => (
                  <motion.div 
                    key={question.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative"
                  >
                    {/* Action Menu (Top Right) */}
                    <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(question)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Question"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(question.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mb-6 pr-12">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          question.type === "MULTIPLE_CHOICE" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {question.type === "MULTIPLE_CHOICE" ? "Multiple Choice" : "Text Answer"}
                        </span>
                        {question.type === "MULTIPLE_CHOICE" && (
                          <span className="text-[10px] font-medium text-gray-400">• {question.options.length} Options</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{question.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{question.description}</p>
                    </div>

                    {/* Answers Section */}
                    <div className="border-t border-gray-50 pt-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Users size={18} className="text-gray-400" />
                          Student Answers 
                          <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {question.answers.length}
                          </span>
                        </h4>
                      </div>

                      {question.answers.length === 0 ? (
                        <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
                          <p className="text-gray-400 text-xs italic">Awaiting student responses...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                          {question.answers.map((answer) => (
                            <div key={answer.id} className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 hover:bg-white hover:border-blue-100 transition-colors">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold uppercase">
                                  {answer.student.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                  <div className="font-bold text-gray-900 text-sm truncate">{answer.student.name}</div>
                                  <div className="text-[10px] text-gray-500 truncate">{answer.student.email}</div>
                                </div>
                              </div>
                              <div className="bg-white border border-gray-50 rounded-lg p-3 text-sm text-gray-700 shadow-sm">
                                {question.type === "MULTIPLE_CHOICE" ? (
                                  <span className="inline-flex items-center gap-2 font-medium text-green-700">
                                    <CheckCircle size={14} />
                                    {answer.answerText}
                                  </span>
                                ) : (
                                  <p className="italic text-gray-600 leading-snug">"{answer.answerText}"</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal Integration */}
      {selectedQuestion && (
        <EditQuestionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          question={selectedQuestion}
          onSuccess={() => {
            setIsEditModalOpen(false);
            fetchQuestions(); // Refresh list after update
          }}
        />
      )}
    </>
  );
}