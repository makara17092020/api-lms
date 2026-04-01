// app/components/dashboard/TeacherStudentTable.tsx
"use client";

import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";

const mockStudents = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", class: "Math 101", progress: 85, status: "active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", class: "Math 101", progress: 72, status: "active" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", class: "Science 202", progress: 90, status: "active" },
  { id: 4, name: "David Wilson", email: "david@example.com", class: "English 101", progress: 68, status: "inactive" },
];

export default function TeacherStudentTable() {
  const [students] = useState(mockStudents);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Students</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage students in your classes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:shadow-lg transition"
        >
          + Add Student
        </button>
      </div>

      <div className="p-6">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="w-full pl-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#7C3AED]"
          />
          <span className="absolute left-5 top-4 text-gray-400">🔍</span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-4 font-medium">Name</th>
              <th className="pb-4 font-medium">Email</th>
              <th className="pb-4 font-medium">Class</th>
              <th className="pb-4 font-medium">Progress</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="py-5 font-medium flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-white flex items-center justify-center font-bold">
                    {student.name[0]}
                  </div>
                  {student.name}
                </td>
                <td className="py-5 text-gray-600">{student.email}</td>
                <td className="py-5 text-gray-600">{student.class}</td>
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7C3AED] to-[#6EE7B7]"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="font-medium w-12">{student.progress}%</span>
                  </div>
                </td>
                <td className="py-5">
                  <span className={`px-4 py-1 text-xs font-medium rounded-full ${
                    student.status === "active" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="py-5 text-right space-x-1">
                  <button className="p-2 text-gray-400 hover:text-[#7C3AED]"><Eye size={18} /></button>
                  <button className="p-2 text-gray-400 hover:text-[#7C3AED]"><Pencil size={18} /></button>
                  <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}