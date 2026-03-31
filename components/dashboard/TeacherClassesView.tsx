// app/components/dashboard/TeacherClassesView.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Users, UserPlus } from "lucide-react";
import AddStudentModal from "@/components/classes/AddStudentModal";
import CreateStudentModal from "@/components/classes/CreateStudentModal";   // ← New

export default function TeacherClassesView() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classes?type=teacher");
      const data = await res.json();
      const normalized = Array.isArray(data) ? data.map((cls: any) => ({
        ...cls,
        students: cls.students || cls.enrollments?.map((e: any) => e.student) || []
      })) : [];
      setClasses(normalized);
    } catch (err) {
      console.error(err);
      setClasses([]);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">My Classes</h2>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl font-medium">No classes assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map((cls: any) => {
            const studentList = cls.students || [];
            return (
              <div key={cls.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{cls.className}</h3>
                    <p className="text-sm text-gray-500 mt-1">{studentList.length} Students</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openAddExisting(cls.id)}
                      className="flex items-center gap-2 bg-[#6EE7B7] hover:bg-[#34D399] text-white px-4 py-2 rounded-2xl text-sm"
                    >
                      <UserPlus size={18} />
                      Add Existing
                    </button>
                    <button
                      onClick={() => openCreateNewStudent(cls.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white px-4 py-2 rounded-2xl text-sm"
                    >
                      <Plus size={18} />
                      Create New
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {studentList.length === 0 ? (
                    <p className="text-gray-400 py-8 text-center">No students yet</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-auto">
                      {studentList.map((s: any) => (
                        <div key={s.id} className="flex justify-between bg-gray-50 rounded-2xl px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] rounded-2xl flex items-center justify-center text-white font-bold">
                              {s.name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium">{s.name}</p>
                              <p className="text-sm text-gray-500">{s.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              if (confirm("Remove student?")) {
                                await fetch(`/api/classes/${cls.id}/students/${s.id}`, { method: "DELETE" });
                                fetchClasses();
                              }
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            Remove
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
      {selectedClassId && (
        <>
          <AddStudentModal
            isOpen={isAddExistingOpen}
            onClose={() => setIsAddExistingOpen(false)}
            classId={selectedClassId}
            onSuccess={handleSuccess}
          />

          <CreateStudentModal
            isOpen={isCreateNewOpen}
            onClose={() => setIsCreateNewOpen(false)}
            classId={selectedClassId}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </div>
  );
}