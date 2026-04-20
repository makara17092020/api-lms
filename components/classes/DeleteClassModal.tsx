"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2, Loader2, X } from "lucide-react";

interface DeleteClassModalProps {
  className: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteClassModal({
  className,
  onClose,
  onConfirm,
}: DeleteClassModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-red-50"
      >
        {/* Warning Header */}
        <div className="relative p-6 bg-red-50 flex flex-col items-center text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-red-100 rounded-full text-red-400 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <AlertTriangle size={28} />
            </div>
          </div>

          <h2 className="text-xl font-bold text-red-900">Confirm Deletion</h2>
          <p className="text-sm text-red-700/80 mt-1 px-4">
            You are about to delete{" "}
            <span className="font-bold text-red-800">"{className}"</span>.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              ⚠️ Warning: This action is permanent. All student enrollments,
              exam records, and study materials associated with this class will
              be lost.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              disabled={isDeleting}
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              No, Keep it
            </button>
            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className="flex-1 py-3 px-4 bg-red-600 text-white rounded-2xl font-semibold shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={18} />
                  Delete Now
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
