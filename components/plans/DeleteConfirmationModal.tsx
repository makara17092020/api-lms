"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteConfirmationModalProps {
  planTopic: string;
  onClose: () => void;
  onConfirm: () => Promise<void>; // ✅ Change this to a Promise!
}

export default function DeleteConfirmationModal({
  planTopic,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(); // ✅ Wait for DB API fetch to finish before doing anything else!
      onClose(); // ✅ Close your modal safely!
    } catch (err) {
      console.error(err);
      setLoading(false); // Unfreeze buttons so they can try again if server is down
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl z-10 border border-white/20 dark:border-slate-800/60 flex flex-col overflow-hidden"
        >
          <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 -z-10 h-32 w-32 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/50 rounded-2xl text-red-600 dark:text-red-400">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Irreversible Action
              </h2>
            </div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="space-y-3 mb-8">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
              Are you sure you want to delete this study plan?
            </p>
            <div className="p-4 bg-red-500/5 dark:bg-red-400/10 border border-red-200/50 dark:border-red-500/20 rounded-2xl">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Plan Topic:{" "}
                <span className="font-bold text-slate-900 dark:text-white leading-relaxed">
                  "{planTopic}"
                </span>
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              All progress, quiz history, and associated task completions linked
              to this specific curriculum will be permanently erased. This
              operation cannot be undone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-auto">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={loading} // ✅ Freezes this button while deleting
              className="w-full h-12 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-40"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              onClick={handleConfirm}
              disabled={loading} // ✅ Freezes this button while deleting
              className="w-full h-12 bg-red-600 dark:bg-red-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Erase in progress...
                </>
              ) : (
                <>Confirm Delete</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
