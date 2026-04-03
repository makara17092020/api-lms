"use client";

import { motion } from "framer-motion";
import { BookOpen, Inbox } from "lucide-react"; // Added Inbox for empty state
import { useTranslations } from "next-intl"; // Added for translations
import ActiveClassCard from "./ActiveClassCard";

interface ClassItem {
  id: string;
  className: string;
  teacher?: { name: string };
}

interface Props {
  classes: ClassItem[];
  loading: boolean;
}

export default function ActiveClassesSection({ classes, loading }: Props) {
  const t = useTranslations("Dashboard");

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40 border border-violet-200 dark:border-violet-800">
            <BookOpen
              className="text-violet-600 dark:text-violet-400"
              size={22}
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t("activeClasses")}
          </h2>
        </div>

        <div className="px-4 py-1.5 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 uppercase tracking-wider">
          {classes.length} {t("classCount")}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-3xl bg-white/50 dark:bg-slate-900/50 animate-pulse border border-white/20 dark:border-slate-700/40 backdrop-blur"
            />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl bg-white/60 dark:bg-slate-900/60 border border-white/30 dark:border-slate-700/40 p-16 text-center backdrop-blur-xl shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <div className="p-5 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600">
              <Inbox size={40} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {t("noClassesTitle")}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
            {t("noClassesDescription")}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ActiveClassCard cls={cls} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
