"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import { ClassModel, Student } from "@/app/(dashboard)/admin/classes/page";

interface AddStudentModalProps {
  cls: ClassModel;
  students: Student[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStudentModal({
  cls,
  students,
  onClose,
  onSuccess,
}: AddStudentModalProps) {
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/classes/${cls.id}/students`, {
        // using your backend's enroll endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl z-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Enroll Student</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500">Target Class</p>
          <p className="text-sm font-semibold text-gray-900">{cls.className}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg mb-4 flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Select Student
            </label>
            <select
              required
              className="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">Choose student indexes...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Enroll Student"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
