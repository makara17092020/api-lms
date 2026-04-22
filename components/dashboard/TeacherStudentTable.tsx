"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Search,
  Loader2,
  UserPlus,
  GraduationCap,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  UserMinus,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CreateStudentModal from "@/components/classes/CreateStudentModal";
// Assuming you have an Edit modal, otherwise this code provides the state for it
// import EditStudentModal from "@/components/classes/EditStudentModal";

export default function TeacherStudentTable() {
  const [data, setData] = useState<{
    students: any[];
    classes: any[];
    loading: boolean;
  }>({
    students: [],
    classes: [],
    loading: true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [modals, setModals] = useState<{
    add: boolean;
    edit: any | null;
    delete: any | null;
  }>({
    add: false,
    edit: null,
    delete: null,
  });

  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const res = await fetch("/api/classes?type=teacher");
      const classes = await res.json();
      const studentMap = new Map();

      classes.forEach((cls: any) => {
        (cls.enrollments || []).forEach((en: any) => {
          if (en.student && !studentMap.has(en.student.id)) {
            studentMap.set(en.student.id, {
              ...en.student,
              className: cls.className || cls.name,
              classId: cls.id,
            });
          }
        });
      });
      setData({
        students: Array.from(studentMap.values()),
        classes,
        loading: false,
      });
    } catch (err) {
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRows = data.students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedData = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleUnenroll = async () => {
    if (!modals.delete) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/classes/${modals.delete.classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeStudentId: modals.delete.id }),
      });
      if (res.ok) {
        await fetchData();
        setModals({ ...modals, delete: null });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6 bg-slate-50/50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Directory
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Manage your students and their course enrollments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none w-full sm:w-64 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setModals({ ...modals, add: true })}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md shadow-slate-200 active:scale-95"
          >
            <UserPlus size={16} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total Students
          </p>
          <p className="text-xl font-black text-slate-900">
            {data.students.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Active Classes
          </p>
          <p className="text-xl font-black text-slate-900">
            {data.classes.length}
          </p>
        </div>
      </div>

      {/* MAIN TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Student Info
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.loading ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-indigo-500 mb-2"
                      size={32}
                    />
                    <p className="text-slate-400 font-medium text-sm">
                      Loading database...
                    </p>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={
                              s.image ||
                              `https://ui-avatars.com/api/?name=${s.name}&background=6366f1&color=fff`
                            }
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50"
                            alt={s.name}
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {s.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {s.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                        <BookOpen size={12} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-700">
                          {s.className}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/en/teacher/plans/${s.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Profile"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button
                          onClick={() => setModals({ ...modals, edit: s })}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                          title="Edit Student"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setModals({ ...modals, delete: s })}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Remove Student"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-slate-400 font-medium text-sm"
                  >
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODERN PAGINATION */}
        <div className="px-6 py-5 flex items-center justify-between bg-slate-50/50 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Showing {paginatedData.length} of {filteredRows.length} students
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-all flex items-center gap-1 shadow-sm"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-all flex items-center gap-1 shadow-sm"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {modals.delete && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModals({ ...modals, delete: null })}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-8 rounded-3xl max-w-sm w-full relative shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Unenroll Student?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                You are about to remove{" "}
                <span className="font-bold text-slate-900">
                  {modals.delete.name}
                </span>{" "}
                from the{" "}
                <span className="font-bold text-indigo-600">
                  {modals.delete.className}
                </span>{" "}
                roster.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModals({ ...modals, delete: null })}
                  className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnenroll}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-center"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Remove Now"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD MODAL */}
      <CreateStudentModal
        isOpen={modals.add}
        onClose={() => setModals({ ...modals, add: false })}
        onSuccess={fetchData}
        classId={data.classes[0]?.id}
      />

      {/* If you have an Edit modal, use it here: */}
      {/* <EditStudentModal
          isOpen={!!modals.edit}
          student={modals.edit}
          onClose={() => setModals({ ...modals, edit: null })}
          onSuccess={fetchData}
      /> */}
    </div>
  );
}
