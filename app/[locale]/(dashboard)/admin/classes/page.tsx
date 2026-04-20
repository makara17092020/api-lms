"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sub-components
import ClassCard from "@/components/classes/ClassCard";
import CreateClassModal from "@/components/classes/CreateClassModal";
import EditClassModal from "@/components/classes/EditClassModal";
import StudentManagementModal from "@/components/classes/StudentManagementModal";
import DeleteClassModal from "@/components/classes/DeleteClassModal"; // The new one
import LoadingSkeleton from "@/components/classes/LoadingSkeleton";
import EmptyState from "@/components/classes/EmptyState";

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface ClassModel {
  id: string;
  className: string;
  teacherId: string;
  teacher: Teacher;
  _count?: { enrollments: number };
  enrollments?: {
    studentId: string;
    student: Student;
  }[];
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");

  // Modals States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassModel | null>(null);
  const [managingClass, setManagingClass] = useState<ClassModel | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassModel | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [teachersRes, studentsRes, classesRes] = await Promise.all([
        fetch("/api/users?role=TEACHER"),
        fetch("/api/users?role=STUDENT"),
        fetch("/api/classes?type=teacher"),
      ]);

      const tData = await teachersRes.json();
      const sData = await studentsRes.json();
      const cData = await classesRes.json();

      setTeachers(tData.users || []);
      setStudents(sData.users || []);
      setClasses(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingClass) return;
    try {
      const res = await fetch(`/api/classes/${deletingClass.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchInitialData();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (cls) =>
        cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [classes, searchTerm]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Class Workspace
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Deploy educational scopes and track enrollment.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm shadow-indigo-200"
        >
          <Plus size={18} />
          Create Class
        </motion.button>
      </div>

      {/* Global Search Mechanism */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search classes..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-lg text-sm outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <SlidersHorizontal size={16} />
          <span>Total: {filteredClasses.length} Modules</span>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredClasses.length === 0 ? (
        <EmptyState
          hasSearchTerm={searchTerm.length > 0}
          onCreateClick={() => setIsCreateOpen(true)}
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                cls={cls}
                onEdit={() => setEditingClass(cls)}
                onManageStudents={() => setManagingClass(cls)}
                onDelete={() => setDeletingClass(cls)} // Modern Popup Trigger
                onRefresh={fetchInitialData} // For student unenrollment refresh
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- State Modals --- */}
      <AnimatePresence>
        {isCreateOpen && (
          <CreateClassModal
            teachers={teachers}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={fetchInitialData}
          />
        )}

        {editingClass && (
          <EditClassModal
            cls={editingClass}
            teachers={teachers}
            onClose={() => setEditingClass(null)}
            onSuccess={fetchInitialData}
          />
        )}

        {managingClass && (
          <StudentManagementModal
            cls={managingClass}
            students={students}
            onClose={() => setManagingClass(null)}
            onSuccess={fetchInitialData}
          />
        )}

        {deletingClass && (
          <DeleteClassModal
            className={deletingClass.className}
            onClose={() => setDeletingClass(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
