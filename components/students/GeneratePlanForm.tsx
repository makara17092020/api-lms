"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  PlusCircle,
  AlertCircle,
  Minus,
  Plus,
} from "lucide-react";

interface Props {
  level: "Beginner" | "Intermediate" | "Advanced";
  setLevel: (level: "Beginner" | "Intermediate" | "Advanced") => void;
  skill: string;
  setSkill: (skill: string) => void;
  timePerDay: number;
  setTimePerDay: (hours: number) => void;
  generating: boolean;
  error: string;
  onGenerate: () => void;
}

export default function GeneratePlanForm({
  level,
  setLevel,
  skill,
  setSkill,
  timePerDay,
  setTimePerDay,
  generating,
  error,
  onGenerate,
}: Props) {
  const suggestions = [
    "React",
    "Node.js",
    "UI/UX Design",
    "Tailwind",
    "TypeScript",
  ];

  const MIN_HOURS = 1;
  const MAX_HOURS = 12;

  const handleDecrease = () => {
    if (timePerDay > MIN_HOURS) {
      setTimePerDay(timePerDay - 1);
    }
  };

  const handleIncrease = () => {
    if (timePerDay < MAX_HOURS) {
      setTimePerDay(timePerDay + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-linear-to-br from-slate-900 to-violet-950 p-6 md:p-10 border border-white/10 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="text-fuchsia-400" size={28} />
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          AI Study Planner
        </h2>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-400/30 p-4 text-red-200 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Level selector - mobile friendly */}
        <div>
          <label className="block text-xs uppercase font-medium text-violet-300 mb-3 tracking-widest">
            Experience Level
          </label>
          <div className="flex gap-2 overflow-x-auto pb-3 md:pb-0 scrollbar-hide snap-x snap-mandatory">
            {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`flex-1 min-w-27.4 snap-start px-5 py-3.5 text-sm font-semibold rounded-3xl transition-all whitespace-nowrap ${
                  level === lvl
                    ? "bg-white text-slate-900 shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Skill input */}
        <div>
          <label className="block text-xs uppercase font-medium text-violet-300 mb-3 tracking-widest">
            What do you want to learn?
          </label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g. Advanced Next.js patterns"
            className="w-full px-6 py-5 bg-white/10 border border-white/20 focus:border-violet-400 rounded-3xl text-white placeholder:text-violet-200/70 text-base focus:outline-none"
          />

          {/* Quick chips - responsive wrap */}
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setSkill(s)}
                className="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-3xl transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 🕒 Time per day (Modernized Stepper) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs uppercase font-medium text-violet-300 tracking-widest">
              Hours per day
            </label>
            <span className="text-xs text-violet-400/80 font-medium">
              Adjust your daily study time easily
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 backdrop-blur-md shadow-inner">
            {/* Decrease Button */}
            <motion.button
              type="button"
              onClick={handleDecrease}
              disabled={timePerDay <= MIN_HOURS}
              whileHover={timePerDay > MIN_HOURS ? { scale: 1.1 } : {}}
              whileTap={timePerDay > MIN_HOURS ? { scale: 0.9 } : {}}
              className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                timePerDay <= MIN_HOURS
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_15px_rgba(167,139,250,0.3)] border border-white/10"
              }`}
            >
              <Minus size={20} />
            </motion.button>

            {/* Counter Output */}
            <div className="flex flex-col items-center justify-center min-w-24">
              <div className="flex items-baseline gap-1">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={timePerDay}
                    initial={{ opacity: 0, y: -15, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="text-5xl font-extrabold text-white tabular-nums tracking-tight"
                  >
                    {timePerDay}
                  </motion.span>
                </AnimatePresence>
                <span className="text-violet-300 text-lg font-medium">h</span>
              </div>
              <span className="text-xs text-violet-400/60 font-medium mt-1">
                daily
              </span>
            </div>

            {/* Increase Button */}
            <motion.button
              type="button"
              onClick={handleIncrease}
              disabled={timePerDay >= MAX_HOURS}
              whileHover={timePerDay < MAX_HOURS ? { scale: 1.1 } : {}}
              whileTap={timePerDay < MAX_HOURS ? { scale: 0.9 } : {}}
              className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                timePerDay >= MAX_HOURS
                  ? "bg-white/5 text-white/20 cursor-not-allowed"
                  : "bg-white/10 text-white hover:bg-white/20 hover:shadow-[0_0_15px_rgba(232,121,249,0.3)] border border-white/10"
              }`}
            >
              <Plus size={20} />
            </motion.button>
          </div>
        </div>

        {/* Generate button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={generating}
          onClick={onGenerate}
          className="w-full h-14 flex items-center justify-center gap-2 bg-linear-to-r from-violet-400 to-fuchsia-400 rounded-3xl text-white font-semibold text-lg shadow-lg disabled:opacity-70"
        >
          {generating ? (
            <>
              <span className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={22} />
              Generate My Plan
              <PlusCircle size={22} />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
