"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, Loader2 } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Smooth Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Card Context */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl z-10 border border-gray-100"
          >
            {!loading && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl mb-4">
                <LogOut size={24} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirm Log Out
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to log out of your session?
              </p>
            </div>

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
                  "Log Out"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
