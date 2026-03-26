"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Import all sections
import HeaderSection from "@/components/students/HeaderSection";
import StatsSection from "@/components/students/StatsSection";
import ActiveClassesSection from "@/components/students/ActiveClassesSection";
import GeneratePlanForm from "@/components/students/GeneratePlanForm";

// Import the reusable skeleton
import LoadingSkeleton from "@/components/students/LoadingSkeleton";

interface ClassItem {
  id: string;
  className: string;
  teacher?: {
    name: string;
  };
}

export default function StudentDashboardPage() {
  const router = useRouter();

  // Data State
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [studyPlanCount, setStudyPlanCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // UI State for the "Premium Focus" effect
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Form state
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Beginner",
  );
  const [skill, setSkill] = useState("");
  const [timePerDay, setTimePerDay] = useState(2);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [classRes, planRes] = await Promise.all([
        fetch("/api/classes?type=student"),
        fetch("/api/ai/plans"),
      ]);

      const classData = await classRes.json();
      setClasses(Array.isArray(classData) ? classData : []);

      const plansData = await planRes.json();
      setStudyPlanCount(Array.isArray(plansData) ? plansData.length : 0);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!skill.trim()) {
      setError("Please enter a topic or skill.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: skill,
          level,
          availableTimePerDay: timePerDay,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      setSkill("");
      router.push("/student/plans");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      {/* 1. FIXED BACKGROUND LAYER */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-[-10%] top-[-15%] h-120 w-120 rounded-full bg-violet-400/10 dark:bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-120 w-120 rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-600/5 blur-[120px]" />
      </div>

      {/* 2. HEADER LAYER: Placed outside of the dimmed content container to stay sharp and clickable */}
      <div className="relative z-100 px-4 pt-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <HeaderSection
          studyPlanCount={studyPlanCount}
          onMenuToggle={(isOpen: boolean) => setIsMenuOpen(isOpen)}
        />
      </div>

      {/* 3. MAIN CONTENT LAYER: Successfully handles the dimming logic WITHOUT affecting the header dropdowns */}
      <main
        className={`
          transition-all duration-500 ease-in-out px-4 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto
          ${isMenuOpen ? "opacity-30 blur-2xl scale-[0.97] pointer-events-none" : "opacity-100 blur-0 scale-100"}
        `}
      >
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-10"
          >
            <StatsSection
              totalClasses={classes.length}
              studyPlanCount={studyPlanCount}
            />

            <ActiveClassesSection
              classes={classes}
              loading={false}
              router={router}
            />

            <GeneratePlanForm
              level={level}
              setLevel={setLevel}
              skill={skill}
              setSkill={setSkill}
              timePerDay={timePerDay}
              setTimePerDay={setTimePerDay}
              generating={generating}
              error={error}
              onGenerate={handleGenerate}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
