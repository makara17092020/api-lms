// app/components/classes/AddStudentModal.tsx
"use client";

import { useState, useMemo } from "react";
import { X, Loader2, Search, UserPlus, Mail, Check } from "lucide-react";

interface AddStudentModalProps {
  isOpen?: boolean;
  cls: any; // ClassModel
  students: any[]; // Student[]
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function AddStudentModal({ isOpen = true, cls, students, onClose, onSuccess }: AddStudentModalProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students?.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [students, searchTerm]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      for (const studentId of selectedStudents) {
        const res = await fetch(`/api/classes/${cls.id}/students`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId }),
        });
        if (!res.ok) throw new Error("Failed to enroll student");
      }

      onSuccess();
      onClose();
      setSelectedStudents([]);
      setSearchTerm("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Add Students</h2>
              <p className="text-indigo-100 mt-1">to {cls.className}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student List */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <UserPlus size={48} className="mx-auto text-gray-300 mb-4" />
                  <p>No students found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => {
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                      <div
                        key={student.id}
                        onClick={() => toggleStudent(student.id)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                          isSelected ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white ${
                              isSelected
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                : 'bg-gray-400'
                            }`}>
                              {student.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail size={14} className="mr-1" />
                                {student.email}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                              <Check size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Count */}
            {selectedStudents.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-sm text-indigo-700">
                  <strong>{selectedStudents.length}</strong> student{selectedStudents.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || selectedStudents.length === 0}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Adding Students...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Add {selectedStudents.length > 0 ? `${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}` : 'Students'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}