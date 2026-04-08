// app/components/dashboard/TeacherClassesView.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Users, UserPlus, X } from "lucide-react";
import AddStudentModal from "@/components/classes/AddStudentModal";
import CreateStudentModal from "@/components/classes/CreateStudentModal";
import CreateQuestionModal from "@/components/classes/CreateQuestionModal";
import ViewQuestionsModal from "@/components/classes/ViewQuestionsModal"; // Add this

type StudentType = {
  id: string;
  name?: string;
  email?: string;
};

type ClassType = {
  id: string;
  className: string;
  students?: StudentType[];
  enrollments?: Array<{ student?: StudentType }>;
  _count?: { enrollments: number; questions?: number };
};

type StudentProgress = {
  classId?: string;
  className?: string;
  totalPlans: number;
  completedTasks: number;
  totalTasks: number;
};

export default function TeacherClassesView() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [classSummary, setClassSummary] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalQuestions: 0,
  });
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isAddExistingOpen, setIsAddExistingOpen] = useState(false);
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = useState(false);
  const [isViewQuestionsOpen, setIsViewQuestionsOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null,
  );
  const [studentProgress, setStudentProgress] =
    useState<StudentProgress | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const [classesRes, studentsRes] = await Promise.all([
        fetch("/api/classes?type=teacher"),
        fetch("/api/users?role=STUDENT"),
      ]);
      const classesData = await classesRes.json();
      const studentsData = await studentsRes.json();
      const normalized: ClassType[] = Array.isArray(classesData)
        ? classesData.map((clsRaw: unknown) => {
            const clsItem = clsRaw as ClassType & {
              enrollments?: Array<{ student?: StudentType }>;
              students?: StudentType[];
            };

            return {
              ...clsItem,
              students:
                clsItem.students ||
                clsItem.enrollments
                  ?.map((e) => e.student)
                  .filter((s): s is StudentType => !!s) ||
                [],
            };
          })
        : [];
      setClasses(normalized);
      setStudents((studentsData as { users?: StudentType[] }).users || []);

      const totalStudents = normalized.reduce(
        (sum, cls) => sum + (cls.students?.length ?? 0),
        0,
      );
      const totalQuestions = normalized.reduce(
        (sum, cls) => sum + (cls._count?.questions ?? 0),
        0,
      );
      setClassSummary({
        totalStudents,
        totalClasses: normalized.length,
        totalQuestions,
      });
    } catch (err) {
      console.error(err);
      setClasses([]);
      setStudents([]);
      setClassSummary({ totalStudents: 0, totalClasses: 0, totalQuestions: 0 });
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

  const openCreateQuestion = (classId: string) => {
    setSelectedClassId(classId);
    setIsCreateQuestionOpen(true);
  };

  const openViewQuestions = (classId: string) => {
    setSelectedClassId(classId);
    setIsViewQuestionsOpen(true);
  };

  const handleSuccess = () => {
    fetchClasses();
    setIsAddExistingOpen(false);
    setIsCreateNewOpen(false);
    setIsCreateQuestionOpen(false);
    setIsViewQuestionsOpen(false);
  };

  const closeProgressModal = () => {
    setSelectedStudent(null);
    setStudentProgress(null);
    setProgressError("");
  };

  const showStudentProgress = async (student: StudentType) => {
    setSelectedStudent(student);
    setStudentProgress(null);
    setProgressError("");
    setProgressLoading(true);

    try {
      const res = await fetch(
        `/api/admin/study-plans/progress?studentId=${student.id}`,
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to load student progress");
      }

      const data = await res.json();
      setStudentProgress(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error("Student progress fetch failed", err);
      const message =
        err instanceof Error ? err.message : "Could not load progress data";
      setProgressError(message);
    } finally {
      setProgressLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading classes...</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Classes</h2>
            <p className="text-gray-600 mt-1">
              Manage your assigned classes, questions and student responses.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold">
              Classes: {classSummary.totalClasses}
            </span>
            <span className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold">
              Students: {classSummary.totalStudents}
            </span>
            <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold">
              Questions: {classSummary.totalQuestions}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Active Classes
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {classSummary.totalClasses}
            </p>
          </div>
          <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Total Students
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {classSummary.totalStudents}
            </p>
          </div>
          <div className="rounded-2xl p-5 border border-gray-100 shadow-sm bg-white">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Total Questions
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {classSummary.totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
          <Users size={64} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No classes assigned yet
          </h3>
          <p className="text-gray-500">
            You will see your classes here once they are assigned to you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {classes.map((cls: ClassType) => {
            const studentList = cls.students || [];
            return (
              <div
                key={cls.id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{cls.className}</h3>
                      <p className="text-indigo-100 mt-1">
                        {studentList.length} Students Enrolled
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 px-2 py-1 rounded-md text-xs">
                        Students: {studentList.length}
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-md text-xs">
                        Questions: {cls._count?.questions ?? 0}
                      </span>
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
                      className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    >
                      <Plus size={18} />
                      Create New
                    </button>
                  </div>
                  <button
                    onClick={() => openCreateQuestion(cls.id)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-6"
                  >
                    <Plus size={18} />
                    Create Question
                  </button>

                  <button
                    onClick={() => openViewQuestions(cls.id)}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Users size={18} />
                    View Questions
                  </button>

                  {studentList.length === 0 ? (
                    <p className="text-gray-400 py-8 text-center">
                      No students yet
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {studentList.map((s: StudentType) => (
                        <div
                          key={s.id}
                          className="flex justify-between items-center bg-gray-50 rounded-2xl px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {s.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {s.name}
                              </p>
                              <p className="text-xs text-gray-500">{s.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => showStudentProgress(s)}
                              className="text-indigo-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="View progress"
                            >
                              <Users size={16} />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm("Remove student?")) {
                                  await fetch(
                                    `/api/classes/${cls.id}/students/${s.id}`,
                                    { method: "DELETE" },
                                  );
                                  fetchClasses();
                                }
                              }}
                              className="text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
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

      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl relative">
            <button
              onClick={closeProgressModal}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              Close
            </button>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedStudent.name} Progress
            </h3>

            {progressLoading ? (
              <p className="text-sm text-gray-500">Loading progress...</p>
            ) : progressError ? (
              <p className="text-sm text-red-500">{progressError}</p>
            ) : studentProgress ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Class: {studentProgress.className || "Unassigned"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Plans: {studentProgress.totalPlans}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Tasks: {studentProgress.totalTasks}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Completed Tasks: {studentProgress.completedTasks}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Completion:{" "}
                  {studentProgress.totalTasks > 0
                    ? `${Math.round((studentProgress.completedTasks / studentProgress.totalTasks) * 100)}%`
                    : "0%"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No progress data found for this student yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddExistingOpen && !!selectedClassId}
        cls={classes.find((c) => c.id === selectedClassId)}
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

      <CreateQuestionModal
        isOpen={isCreateQuestionOpen && !!selectedClassId}
        onClose={() => setIsCreateQuestionOpen(false)}
        classId={selectedClassId || ""}
        onSuccess={handleSuccess}
      />

      <ViewQuestionsModal
        isOpen={isViewQuestionsOpen && !!selectedClassId}
        onClose={() => setIsViewQuestionsOpen(false)}
        classId={selectedClassId || ""}
      />
    </div>
  );
}
