// app/components/classes/AddStudentModal.tsx
"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface AddStudentModalProps {
  cls: any; // ClassModel
  students: any[]; // Student[]
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export default function AddStudentModal({ cls, students, onClose, onSuccess }: AddStudentModalProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-3xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Add Students to {cls.className}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Select Students</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {students.map((student) => (
                <label key={student.id} className="flex items-center space-x-2">
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
                  />
                  <span>{student.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || selectedStudents.length === 0}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Add Students"}
          </button>
        </form>
      </div>
    </div>
  );
}