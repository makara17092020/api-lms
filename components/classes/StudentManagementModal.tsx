"use client";

import { useState } from "react";
import { X, Loader2, Search, UserPlus, Plus } from "lucide-react";

interface StudentManagementModalProps {
  isOpen?: boolean;
  cls: any; // ClassModel
  students: any[]; // Student[]
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function StudentManagementModal({ isOpen = true, cls, students, onClose, onSuccess }: StudentManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'create'>('add');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create student form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!isOpen || !cls) return null;

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudents = async (e: React.FormEvent) => {
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

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create new student
      const createRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "STUDENT",
        }),
      });

      const newStudent = await createRes.json();

      if (!createRes.ok) throw new Error(newStudent.error || "Failed to create student");

      // 2. Enroll the new student to the class
      const enrollRes = await fetch(`/api/classes/${cls.id}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: newStudent.id }),
      });

      if (!enrollRes.ok) throw new Error("Student created but failed to enroll");

      onSuccess();
      onClose();
      setFormData({ name: "", email: "", password: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900">Manage Students - {cls.className}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'add'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserPlus size={18} className="inline mr-2" />
            Add Existing Students
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'create'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Plus size={18} className="inline mr-2" />
            Create New Student
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {activeTab === 'add' ? (
            <form onSubmit={handleAddStudents} className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              {/* Student List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Available Students ({filteredStudents.length})
                  </h3>
                  <span className="text-xs text-gray-500">
                    {selectedStudents.length} selected
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
                  {filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No students found matching your search.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredStudents.map((student) => (
                        <label
                          key={student.id}
                          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudents([...selectedStudents, student.id]);
                              } else {
                                setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                              }
                            }}
                            className="mr-4 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.email}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || selectedStudents.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Adding Students...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Add {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateStudent} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="Create a secure password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creating Student...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create & Enroll Student
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}