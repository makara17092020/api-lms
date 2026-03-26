"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

interface RemoveStudentProps {
  classId: string;
  studentId: string;
  onSuccess: () => void;
}

export default function RemoveStudentButton({
  classId,
  studentId,
  onSuccess,
}: RemoveStudentProps) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    if (
      !confirm(
        "Are you sure you want to remove this student from the class? (This will NOT delete their account)",
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/classes/${classId}/students/${studentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove student");
      }

      onSuccess(); // Triggers page refresh
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
      title="Unenroll student"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
    </button>
  );
}
