"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Trash2, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  loading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl z-10 border border-gray-100"
          >
            {/* Close Button */}
            {!loading && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              {/* Animated Warning Icon */}
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl mb-4">
                <Trash2 size={24} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 mb-6">{description}</p>
            </div>

            {/* Actions Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="py-2.5 border border-gray-200 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
