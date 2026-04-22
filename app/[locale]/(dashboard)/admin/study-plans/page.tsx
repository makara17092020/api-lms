"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StudyPlannerHeader from "@/components/study-planner/StudyPlannerHeader";
import StudyPlannerFilters from "@/components/study-planner/StudyPlannerFilters";
import StudyPlannerTable, {
  StudentProgress,
} from "@/components/study-planner/StudyPlannerTable";

interface ClassType {
  id: string;
  className: string;
}

export default function AdminStudyPlansPage() {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();

  // 🎯 Track current class using Next.js URL state
  const selectedClassId = searchParams.get("classId") || "all";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ Change to this:
      const [studentsRes, classesRes] = await Promise.all([
        fetch("/api/admin/study-plans/progress"),
        fetch("/api/classes?type=teacher"), // 👈 Removed the extra "/admin"
      ]);

      let studentsData = [];
      let classesData = [];

      if (studentsRes.ok) studentsData = await studentsRes.json();
      if (classesRes.ok) classesData = await classesRes.json();

      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (error) {
      console.error("🚨 Fetching failed gracefully:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌪️ Combines Search Bar text & Dropdown Class selection
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass =
      selectedClassId === "all" || student.classId === selectedClassId; // Uses the URL classId state!

    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen p-6 md:p-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        <StudyPlannerHeader
          title="Student Curriculums"
          subtitle="Monitor generated AI pathways."
        />

        <StudyPlannerFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          classes={classes} // Passes classes into your dropdown
        />

        {/* 📊 The table automatically filters because it watches `filteredStudents` */}
        <StudyPlannerTable
          students={filteredStudents}
          loading={loading}
          role={"admin"}
        />
      </div>
    </div>
  );
}
