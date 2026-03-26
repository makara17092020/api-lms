"use client";

interface LevelSelectorProps {
  level: string;
  onChange: (level: "Beginner" | "Intermediate" | "Advanced") => void;
}

export default function LevelSelector({ level, onChange }: LevelSelectorProps) {
  return (
    <div>
      <p className="uppercase text-xs font-bold tracking-[1px] text-gray-400 dark:text-gray-500 mb-3">
        Your Current Level
      </p>
      <select
        value={level}
        onChange={(e) => onChange(e.target.value as any)}
        className="w-full px-7 py-5 bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/20 rounded-3xl text-lg focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-400 transition-all cursor-pointer"
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>
  );
}
