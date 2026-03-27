"use client";

import { motion } from "framer-motion";
import { Check, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface LevelSelectorProps {
  level: "Beginner" | "Intermediate" | "Advanced";
  onChange: (level: "Beginner" | "Intermediate" | "Advanced") => void;
}

export default function LevelSelector({ level, onChange }: LevelSelectorProps) {
  const options = [
    {
      id: "Beginner" as const,
      label: "Beginner",
      desc: "New to the topic",
      icon: Shield,
      accent: "from-emerald-500/20 to-emerald-400/20",
      border: "border-emerald-500/30",
      text: "text-emerald-500 dark:text-emerald-400",
    },
    {
      id: "Intermediate" as const,
      label: "Intermediate",
      desc: "Have some basics",
      icon: ShieldCheck,
      accent: "from-violet-500/20 to-violet-400/20",
      border: "border-violet-500/30",
      text: "text-violet-500 dark:text-violet-400",
    },
    {
      id: "Advanced" as const,
      label: "Advanced",
      desc: "Deep dive mechanics",
      icon: ShieldAlert,
      accent: "from-fuchsia-500/20 to-fuchsia-400/20",
      border: "border-fuchsia-500/30",
      text: "text-fuchsia-500 dark:text-fuchsia-400",
    },
  ];

  return (
    <div className="w-full">
      <p className="uppercase text-xs font-bold tracking-[1px] text-slate-400 dark:text-slate-500 mb-4">
        Your Experience Level
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isActive = level === opt.id;
          const IconComponent = opt.icon;

          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center justify-between p-5 rounded-3xl border text-left transition-all ${
                isActive
                  ? `bg-white dark:bg-slate-900 border-violet-500 shadow-lg shadow-violet-500/10 dark:shadow-violet-500/5`
                  : "bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Visual Icon with soft glow */}
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${
                    isActive ? opt.accent : "bg-slate-100 dark:bg-white/5"
                  } transition-colors`}
                >
                  <IconComponent
                    size={22}
                    className={
                      isActive ? opt.text : "text-slate-400 dark:text-slate-500"
                    }
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {opt.label}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </div>

              {/* Verified Visual Circle Mark Check */}
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isActive
                    ? "bg-violet-500 border-violet-500 text-white"
                    : "border-slate-300 dark:border-white/20 text-transparent"
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
