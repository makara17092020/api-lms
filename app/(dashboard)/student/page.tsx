// ========================
// UPDATED File: app/student/dashboard/page.tsx
// ========================
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Import all sections
import HeaderSection from "@/components/students/HeaderSection";
import StatsSection from "@/components/students/StatsSection";
import ActiveClassesSection from "@/components/students/ActiveClassesSection";
import GeneratePlanForm from "@/components/students/GeneratePlanForm";

// NEW: Import the reusable skeleton
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
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [studyPlanCount, setStudyPlanCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-linear-to-br from-indigo-50/70 via-white to-fuchsia-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950">
      {/* Background blobs (unchanged) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-[-10%] top-[-15%] h-96 w-96 rounded-full bg-violet-300/20 dark:bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-96 w-96 rounded-full bg-fuchsia-300/20 dark:bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="px-4 py-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
        {loading ? (
          // Premium full-dashboard skeleton
          <LoadingSkeleton />
        ) : (
          // Real content (only rendered after loading is false)
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            <HeaderSection studyPlanCount={studyPlanCount} />
            <StatsSection
              totalClasses={classes.length}
              studyPlanCount={studyPlanCount}
            />
            <ActiveClassesSection
              classes={classes}
              loading={false} // no longer needed inside section
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
      </div>
    </div>
  );
}
