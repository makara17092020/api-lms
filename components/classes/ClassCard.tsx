"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Edit2,
  UserPlus,
  Trash2,
  GraduationCap,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import { ClassModel } from "@/app/[locale]/(dashboard)/admin/classes/page";

interface ClassCardProps {
  cls: ClassModel;
  onEdit: () => void;
  onManageStudents: () => void;
  onDelete: () => void; // This opens the delete modal
  onRefresh: () => void; // To refresh student list after unenrollment
}

export default function ClassCard({
  cls,
  onEdit,
  onManageStudents,
  onDelete,
  onRefresh,
}: ClassCardProps) {
  const [isStudentsExpanded, setIsStudentsExpanded] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(
    null,
  );

  const handleRemoveStudent = async (
    studentId: string,
    studentName: string,
  ) => {
    // Keep this one simple confirm or it will be too many modals
    if (!confirm(`Unenroll ${studentName} from this class?`)) return;

    setRemovingStudentId(studentId);
    try {
      const res = await fetch(`/api/classes/${cls.id}/students/${studentId}`, {
        method: "DELETE",
      });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error("Failed to unenroll student:", err);
    } finally {
      setRemovingStudentId(null);
    }
  };

  return (
    <motion.div
      layout
      className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-all ${
        isStudentsExpanded ? "min-h-88" : "h-64"
      }`}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen size={24} />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mt-4 truncate">
          {cls.className}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Instructor:{" "}
          <span className="text-gray-900 font-medium">
            {cls.teacher?.name || "Unassigned"}
          </span>
        </p>
      </div>

      <div className="mt-4 flex-1 flex flex-col justify-end">
        <AnimatePresence>
          {isStudentsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="border-t border-gray-100 pt-3 mt-1 space-y-1.5 max-h-32 overflow-y-auto pr-1">
                <p className="text-[10px] uppercase font-bold text-gray-400">
                  Enrolled Students
                </p>
                {cls.enrollments?.map((item: any) => (
                  <div
                    key={item.studentId}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-xs"
                  >
                    <span className="truncate text-gray-700">
                      {item.student?.name}
                    </span>
                    <button
                      disabled={removingStudentId === item.studentId}
                      onClick={() =>
                        handleRemoveStudent(item.studentId, item.student?.name)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {removingStudentId === item.studentId ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <X size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={() => setIsStudentsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"
          >
            <GraduationCap size={16} />
            <span>{cls._count?.enrollments || 0} students</span>
            <motion.div animate={{ rotate: isStudentsExpanded ? 180 : 0 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>
          <button
            onClick={onManageStudents}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            <UserPlus size={16} />
            Manage
          </button>
        </div>
      </div>
    </motion.div>
  );
}
