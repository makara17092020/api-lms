"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface User {
  id: string;
  role: "STUDENT" | "TEACHER" | "SUPER_ADMIN" | "student" | "teacher" | "admin";
  createdAt: string;
}

type Period = "month" | "day";

type ChartDataPoint = {
  [key: string]: string | number;
  students: number;
  teachers: number;
};

export default function UserTrendsChart() {
  const [users, setUsers] = useState<User[]>([]);
  const [period, setPeriod] = useState<Period>("month");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      if (!data.users || data.users.length === 0) {
        throw new Error("No database metrics detected yet.");
      }
      setUsers(data.users);
    } catch (err: any) {
      console.error("UserTrendsChart fetch error:", err);
      setError(err.message || "Unable to load real data – using sample trends");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getSampleData = (p: Period): ChartDataPoint[] => {
    if (p === "month") {
      return [
        { month: "2026-01", students: 1240, teachers: 320 },
        { month: "2026-02", students: 1380, teachers: 340 },
        { month: "2026-03", students: 1520, teachers: 370 },
        { month: "2026-04", students: 1490, teachers: 390 },
        { month: "2026-05", students: 1680, teachers: 410 },
        { month: "2026-06", students: 1750, teachers: 430 },
      ];
    }
    return [
      { day: "2026-03-20", students: 42, teachers: 11 },
      { day: "2026-03-21", students: 38, teachers: 14 },
      { day: "2026-03-22", students: 55, teachers: 9 },
      { day: "2026-03-23", students: 61, teachers: 18 },
      { day: "2026-03-24", students: 47, teachers: 12 },
      { day: "2026-03-25", students: 52, teachers: 15 },
    ];
  };

  const transformData = (userList: User[], p: Period): ChartDataPoint[] => {
    const aggregation = new Map<
      string,
      { students: number; teachers: number }
    >();

    userList.forEach((user) => {
      if (!user.createdAt) return;
      const date = new Date(user.createdAt);
      const key =
        p === "month"
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          : date.toISOString().split("T")[0];

      if (!aggregation.has(key)) {
        aggregation.set(key, { students: 0, teachers: 0 });
      }
      const counts = aggregation.get(key)!;

      // ✅ 2. Case-Insensitive Check (Fixes database standard caps parsing)
      const role = user.role.toLowerCase();
      if (role === "student") counts.students += 1;
      else if (role === "teacher") counts.teachers += 1;
    });

    const sortedKeys = Array.from(aggregation.keys()).sort();
    return sortedKeys.map((key) => {
      const counts = aggregation.get(key)!;
      return {
        [p]: key,
        students: counts.students,
        teachers: counts.teachers,
      } as ChartDataPoint;
    });
  };

  const chartData = useMemo(() => {
    if (users.length === 0) {
      return getSampleData(period);
    }
    return transformData(users, period);
  }, [users, period]);

  const getTrend = (key: "students" | "teachers") => {
    if (chartData.length < 2) {
      return { direction: "up" as const, change: 0 };
    }
    const last = chartData[chartData.length - 1][key] as number;
    const prev = chartData[chartData.length - 2][key] as number;
    const diff = last - prev;
    const change = prev === 0 ? 0 : (diff / prev) * 100;
    return {
      direction: diff >= 0 ? ("up" as const) : ("down" as const),
      change: Math.abs(parseFloat(change.toFixed(1))),
    };
  };

  const studentTrend = getTrend("students");
  const teacherTrend = getTrend("teachers");
  const xDataKey = period === "month" ? "month" : "day";

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={itemVars}
      initial="initial"
      animate="animate"
      className="relative bg-white/30 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-900/5 rounded-2xl">
              <TrendingUp size={24} className="text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                User Trends
              </h2>
              <p className="text-sm text-gray-500">
                {period === "month" ? "Monthly" : "Daily"} • Students & Teachers
              </p>
            </div>
          </div>

          {/* iOS Toggle */}
          <div className="sm:ml-6 flex bg-white/40 backdrop-blur-2xl rounded-3xl p-1 border border-white/30 shadow-inner">
            <button
              onClick={() => setPeriod("month")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-3xl transition-all ${
                period === "month"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setPeriod("day")}
              className={`px-5 py-1.5 text-sm font-semibold rounded-3xl transition-all ${
                period === "day"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Day
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-indigo-500 shrink-0 shadow-inner" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Students
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">
                  {chartData[chartData.length - 1]?.students.toLocaleString() ||
                    0}
                </span>
                <span
                  className={`inline-flex items-center text-sm font-medium ${
                    studentTrend.direction === "up"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {studentTrend.direction === "up" ? "↑" : "↓"}
                  <span className="ml-0.5 text-xs">{studentTrend.change}%</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0 shadow-inner" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Teachers
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">
                  {chartData[chartData.length - 1]?.teachers.toLocaleString() ||
                    0}
                </span>
                <span
                  className={`inline-flex items-center text-sm font-medium ${
                    teacherTrend.direction === "up"
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {teacherTrend.direction === "up" ? "↑" : "↓"}
                  <span className="ml-0.5 text-xs">{teacherTrend.change}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-100 w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm rounded-3xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading real trends...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-3xl">
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-5 py-2 bg-white rounded-2xl text-sm font-medium shadow-sm hover:shadow transition-all"
            >
              <RefreshCw size={16} />
              Retry
            </button>
            <p className="text-xs text-gray-400 mt-6">
              Showing sample data for now
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0, 0, 0, 0.03)"
                vertical={true}
              />
              <XAxis
                dataKey={xDataKey}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
                dy={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="students"
                name="Students"
                stroke="#6366f1"
                strokeWidth={3.5}
                dot={{
                  fill: "#6366f1",
                  stroke: "#ffffff",
                  strokeWidth: 2.5,
                  r: 4.5,
                }}
                activeDot={{
                  r: 7,
                  fill: "#6366f1",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="teachers"
                name="Teachers"
                stroke="#f59e0b"
                strokeWidth={3.5}
                dot={{
                  fill: "#f59e0b",
                  stroke: "#ffffff",
                  strokeWidth: 2.5,
                  r: 4.5,
                }}
                activeDot={{
                  r: 7,
                  fill: "#f59e0b",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}

// iOS Glass Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/75 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] min-w-50">
        <p className="text-xs font-bold text-gray-400 tracking-widest mb-3">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-8 mb-3 last:mb-0"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-2xl shrink-0"
                style={{ backgroundColor: entry.stroke }}
              />
              <span className="font-medium text-gray-700 text-sm">
                {entry.name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-2xl text-gray-900 tabular-nums">
                {entry.value}
              </span>
              <span className="text-xs font-medium text-gray-500 ml-1">
                Users
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
