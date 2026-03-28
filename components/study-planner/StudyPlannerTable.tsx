"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  UserCheck,
  SearchX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface StudentProgress {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  classId: string;
  className: string;
  totalPlans: number;
  completedTasks: number;
  totalTasks: number;
}

interface StudyPlannerTableProps {
  students: StudentProgress[];
  loading: boolean;
  itemsPerPage?: number;
}

export default function StudyPlannerTable({
  students,
  loading,
  itemsPerPage = 6, // 🚀 Default pagination rate
}: StudyPlannerTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // 📐 Client-side Pagination Metrics
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return students.slice(start, start + itemsPerPage);
  }, [students, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 🎨 Dynamic color state generator based on task completeness
  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-emerald-500";
    if (percent >= 50) return "bg-gradient-to-r from-indigo-500 to-fuchsia-500";
    if (percent >= 25) return "bg-gradient-to-r from-amber-500 to-orange-500";
    return "bg-rose-500";
  };

  const getProgressText = (percent: number) => {
    if (percent === 100) return "text-emerald-500";
    if (percent >= 50) return "text-indigo-600 dark:text-indigo-400";
    if (percent >= 25) return "text-amber-500";
    return "text-rose-500";
  };

  // ⏳ Shimmer Loading Skeleton State
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(itemsPerPage)].map((_, idx) => (
          <div
            key={idx}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse space-y-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-2" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full mt-2" />
          </div>
        ))}
      </div>
    );
  }

  // 🔍 Animated Zero Results Empty UI State
  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg"
      >
        <div className="p-5 bg-slate-100 dark:bg-slate-800 rounded-full mb-5 shadow-inner">
          <SearchX size={42} className="text-slate-400" />
        </div>
        <p className="text-xl font-bold text-slate-800 dark:text-white">
          No students found
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          Try resetting filters or adjusting search parameters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 📱 Mobile Card Layout & 🖥️ Desktop Fluid Table in ONE */}
      <div className="bg-white dark:bg-slate-900 md:border md:border-slate-200 md:dark:border-slate-800 rounded-3xl overflow-hidden shadow-md">
        {/* 💻 Desktop View (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Student Profile
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Classroom
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Modules
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Success Rate Progress
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {currentStudents.map((student) => {
                  const percentage =
                    student.totalTasks === 0
                      ? 0
                      : Math.round(
                          (student.completedTasks / student.totalTasks) * 100,
                        );

                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-all hover:shadow-md cursor-default"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.profileImage ? (
                            <img
                              src={student.profileImage}
                              alt={student.name}
                              className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                            />
                          ) : (
                            <div className="h-11 w-11 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold rounded-full ring-2 ring-indigo-50 dark:ring-indigo-900/20">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                              {student.name}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl shadow-sm">
                          {student.className}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-white">
                          <BookOpen size={15} className="text-slate-400" />
                          {student.totalPlans} Path(s)
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-full max-w-40 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className={getProgressText(percentage)}>
                              {percentage}%
                            </span>
                            <span className="text-slate-400">
                              {student.completedTasks}/{student.totalTasks} Done
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${getProgressColor(percentage)} transition-all`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/study-plans/${student.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <UserCheck size={14} />
                          View Profile
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile UI (Grid of Cards) */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-4">
          <AnimatePresence mode="wait">
            {currentStudents.map((student) => {
              const percentage =
                student.totalTasks === 0
                  ? 0
                  : Math.round(
                      (student.completedTasks / student.totalTasks) * 100,
                    );

              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-4">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold rounded-full">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl">
                      {student.className}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <BookOpen size={14} className="text-slate-400" />
                      {student.totalPlans} Path(s)
                    </span>
                    <span className="text-slate-500">
                      {student.completedTasks}/{student.totalTasks} Tasks
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${getProgressColor(percentage)}`}
                      />
                    </div>
                    <p
                      className={`text-xs font-bold text-right ${getProgressText(percentage)}`}
                    >
                      {percentage}% Complete
                    </p>
                  </div>

                  <Link
                    href={`/admin/study-plans/${student.id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white hover:bg-indigo-600 font-bold text-xs rounded-xl transition-all"
                  >
                    <UserCheck size={14} />
                    View Student Profile
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 📊 Smooth Pagination Feature & Animated Controllers */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <span className="text-xs font-bold text-slate-500">
            Showing Page{" "}
            <span className="text-slate-800 dark:text-white">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="text-slate-800 dark:text-white">{totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all shadow-sm"
              aria-label="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Pagination Numbers and Dynamic Mapping */}
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-slate-900 transition-all shadow-sm"
              aria-label="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
