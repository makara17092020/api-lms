"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import UserTrendsChart from "@/components/dashboard/UserTrendsChart";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton"; // 👈 Pull in skeletons


interface DashboardMetrics {
  totalUsers: number;
  students: number;
  teachers: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    students: 0,
    teachers: 0,
  });

  const [loading, setLoading] = useState(true); // 👈 Initial load trigger

  useEffect(() => {
    // 1. Function to pull metrics
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
      } catch (error) {
        console.error("Metric fetch failed", error);
      } finally {
        setLoading(false); // Drop initial loader
      }
    };

    fetchMetrics();

    // 2. 📡 Listen for Sidebar manual refresh broadcast
    const handleRefreshEvent = () => {
      setLoading(true); // Trigger UI Skeletons
      fetchMetrics(); // Re-fetch active platform metrics
    };

    window.addEventListener("trigger-dashboard-refresh", handleRefreshEvent);
    return () =>
      window.removeEventListener(
        "trigger-dashboard-refresh",
        handleRefreshEvent,
      );
  }, []);

  const containerVars = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6 },
    },
  };

  // 🚦 Show pulse skeleton viewport if loading or refreshing
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="relative min-h-screen p-6 md:p-10 overflow-hidden bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] -z-10" />

      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto space-y-10"
      >
        <header>
          <motion.h1
            className="text-4xl font-extrabold text-gray-900 tracking-tight"
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
          >
            Workspace Overview
          </motion.h1>
          <motion.p
            className="text-lg text-gray-500 font-medium"
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
            }}
          >
            Real-time platform usage and user analytics.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title="Total Platform Users"
            value={metrics.totalUsers}
            icon={Users}
            gradient="from-blue-500 to-indigo-600"
            delay={0.1}
          />
          <StatCard
            title="Enrolled Students"
            value={metrics.students}
            icon={GraduationCap}
            gradient="from-emerald-400 to-teal-600"
            delay={0.2}
          />
          <StatCard
            title="Active Teachers"
            value={metrics.teachers}
            icon={Briefcase}
            gradient="from-orange-400 to-amber-600"
            delay={0.3}
          />
        </div>

        <UserTrendsChart />
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, gradient, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
      className="relative group flex flex-col justify-between p-8 bg-white/30 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="flex justify-between items-start">
        <div
          className={`p-4 rounded-3xl bg-linear-to-br ${gradient} shadow-lg shadow-indigo-200/40 text-white`}
        >
          <Icon size={26} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">
          {title}
        </p>
        <p className="text-5xl font-black text-gray-900 tracking-tighter">
          {value.toLocaleString()}
        </p>
      </div>

      <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/20 group-hover:ring-indigo-400/30 transition-all" />
    </motion.div>
  );
}
