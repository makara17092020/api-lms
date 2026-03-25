"use client";

import { motion } from "framer-motion";
import { BookOpen, Edit2, UserPlus, Trash2, GraduationCap } from "lucide-react";
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
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${cls.className}"?`)) return;

    try {
      const res = await fetch(`/api/classes/${cls.id}`, { method: "DELETE" });
      if (res.ok) onDelete();
    } catch (err) {
      console.error("Deletion failed:", err);
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
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all h-64"
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
              onClick={handleDelete}
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

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <GraduationCap size={16} className="text-gray-400" />
          <span>{cls._count?.enrollments || 0} enrolled students</span>
        </div>
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
    </motion.div>
  );
}
