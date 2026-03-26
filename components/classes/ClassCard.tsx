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
import { ClassModel } from "@/app/(dashboard)/admin/classes/page";

interface ClassCardProps {
  cls: ClassModel;
  onEdit: () => void;
  onAddStudent: () => void;
  onDelete: () => void;
}

export default function ClassCard({
  cls,
  onEdit,
  onAddStudent,
  onDelete,
}: ClassCardProps) {
  const [isStudentsExpanded, setIsStudentsExpanded] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(
    null,
  );

  const handleDeleteClass = async () => {
    if (
      !confirm(
        `Are you sure you want to delete the entire class "${cls.className}"?`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/classes/${cls.id}`, { method: "DELETE" });
      if (res.ok) onDelete();
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  const handleRemoveStudent = async (
    studentId: string,
    studentName: string,
  ) => {
    if (
      !confirm(
        `Unenroll ${studentName} from this class? This will not delete their account.`,
      )
    )
      return;

    setRemovingStudentId(studentId);

    try {
      const res = await fetch(`/api/classes/${cls.id}/students/${studentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // We use the parent onDelete callback to refresh page data (fetchInitialData)
        onDelete();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove student");
      }
    } catch (err) {
      console.error("Failed to unenroll student:", err);
    } finally {
      setRemovingStudentId(null);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all ${
        isStudentsExpanded ? "min-h-[22rem]" : "h-64"
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
              onClick={handleDeleteClass}
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
        {/* Accordion: Student Enrollments List */}
        <AnimatePresence>
          {isStudentsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="border-t border-gray-100 pt-3 mt-1 space-y-1.5 max-h-32 overflow-y-auto pr-1">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Enrolled Students
                </p>
                {/* NOTE: Ensure your `/api/classes` query includes student context inside enrollments array!
                 */}
                {cls.enrollments && cls.enrollments.length > 0 ? (
                  cls.enrollments.map((item: any) => (
                    <div
                      key={item.studentId}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-xs"
                    >
                      <span className="truncate font-medium text-gray-700">
                        {item.student?.name || "Unknown Student"}
                      </span>
                      <button
                        disabled={removingStudentId === item.studentId}
                        onClick={() =>
                          handleRemoveStudent(
                            item.studentId,
                            item.student?.name,
                          )
                        }
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {removingStudentId === item.studentId ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <X size={14} />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    No students yet.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={() => setIsStudentsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            <GraduationCap size={16} className="text-gray-400" />
            <span>{cls._count?.enrollments || 0} students</span>
            <motion.div
              animate={{ rotate: isStudentsExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} />
            </motion.div>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddStudent}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <UserPlus size={14} />
            Add Student
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
