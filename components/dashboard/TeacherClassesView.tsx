// app/components/dashboard/TeacherClassesView.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Users, UserPlus, X } from "lucide-react";
import AddStudentModal from "@/components/classes/AddStudentModal";
import CreateStudentModal from "@/components/classes/CreateStudentModal";   // ← Fixed

export default function TeacherClassesView() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const [classesRes, studentsRes] = await Promise.all([
        fetch("/api/classes?type=teacher"),
        fetch("/api/users?role=STUDENT"),
      ]);
      const classesData = await classesRes.json();
      const studentsData = await studentsRes.json();
      const normalized = Array.isArray(classesData) ? classesData.map((cls: any) => ({
        ...cls,
        students: cls.students || cls.enrollments?.map((e: any) => e.student) || []
      })) : [];
      setClasses(normalized);
      setStudents(studentsData.users || []);
    } catch (err) {
      console.error(err);
      setClasses([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openAddExisting = (classId: string) => {
    setSelectedClassId(classId);
    setIsAddExistingOpen(true);
  };

  const openCreateNewStudent = (classId: string) => {
    setSelectedClassId(classId);
    setIsCreateNewOpen(true);
  };

  const handleSuccess = () => {
    fetchClasses();
    setIsAddExistingOpen(false);
    setIsCreateNewOpen(false);
  };

  if (loading) return <div className="text-center py-20">Loading classes...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Classes</h2>
          <p className="text-gray-600 mt-1">Manage your assigned classes and students</p>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
          <Users size={64} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes assigned yet</h3>
          <p className="text-gray-500">You'll see your classes here once they're assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {classes.map((cls: any) => {
            const studentList = cls.students || [];
            return (
              <div key={cls.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{cls.className}</h3>
                      <p className="text-indigo-100 mt-1">{studentList.length} Students Enrolled</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => openAddExisting(cls.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    >
                      <UserPlus size={18} />
                      Add Existing
                    </button>
                    <button
                      onClick={() => openCreateNewStudent(cls.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Plus size={18} />
                      Create New
                    </button>
                  </div>

                  {studentList.length === 0 ? (
                    <p className="text-gray-400 py-8 text-center">No students yet</p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {studentList.map((s: any) => (
                        <div key={s.id} className="flex justify-between items-center bg-gray-50 rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {s.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{s.name}</p>
                              <p className="text-xs text-gray-500">{s.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm("Remove student?")) {
                                await fetch(`/api/classes/${cls.id}/students/${s.id}`, { method: "DELETE" });
                                fetchClasses();
                              }
                            }}
                            className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddExistingOpen && !!selectedClassId}
        cls={classes.find(c => c.id === selectedClassId)}
        students={students}
        onClose={() => setIsAddExistingOpen(false)}
        onSuccess={handleSuccess}
      />

      <CreateStudentModal
        isOpen={isCreateNewOpen && !!selectedClassId}
        onClose={() => setIsCreateNewOpen(false)}
        classId={selectedClassId || ""}
        onSuccess={handleSuccess}
      />
    </div>
  );
}