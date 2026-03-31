"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import { Teacher } from "@/app/(dashboard)/admin/classes/page";

interface CreateClassModalProps {
  teachers: Teacher[];
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function CreateClassModal({
  teachers,
  onClose,
  onSuccess,
}: CreateClassModalProps) {
  const [className, setClassName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className, teacherId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Creation failed");
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
          <h2 className="text-xl font-bold text-gray-900">
            New Class Workspace
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg mb-4 flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Class Name
            </label>
            <input
              type="text"
              required
              className="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition-all"
              placeholder="e.g. Modern PostgreSQL Design"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Instructor Assign
            </label>
            <select
              required
              className="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            >
              <option value="">Select an instructor...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Launch Class"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
