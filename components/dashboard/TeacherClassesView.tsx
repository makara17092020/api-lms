"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  UserPlus,
  X,
  Eye,
  BookOpen,
  Layers,
  MessageSquare,
  Loader2,
} from "lucide-react";
import AddStudentModal from "@/components/classes/AddStudentModal";
import CreateStudentModal from "@/components/classes/CreateStudentModal";
import CreateQuestionModal from "@/components/classes/CreateQuestionModal";
import ViewQuestionsModal from "@/components/classes/ViewQuestionsModal";

export default function TeacherClassesView() {
  const [data, setData] = useState({
    classes: [],
    students: [],
    loading: true,
  });
  const [modals, setModals] = useState({ type: null, classId: null });
  const [progress, setProgress] = useState({
    student: null,
    stats: null,
    loading: false,
  });

  const fetchData = async () => {
    try {
      const [cRes, sRes] = await Promise.all([
        fetch("/api/classes?type=teacher"),
        fetch("/api/users?role=STUDENT"),
      ]);
      const classes = await cRes.json();
      const students = await sRes.json();

      setData({
        classes: classes.map((cls: any) => ({
          ...cls,
          students:
            cls.students ||
            cls.enrollments?.map((e: any) => e.student).filter(Boolean) ||
            [],
        })),
        students: students.users || [],
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data.loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="font-bold tracking-widest text-xs uppercase">
          Syncing Curriculum...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Assigned Classes
          </h2>
          <p className="text-gray-500 font-medium">
            Coordinate your students and lecture content
          </p>
        </div>
      </div>

      {data.classes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {data.classes.map((cls: any) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              onAction={(type: any) => setModals({ type, classId: cls.id })}
              refresh={fetchData}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddStudentModal
        isOpen={modals.type === "add"}
        cls={data.classes.find((c: any) => c.id === modals.classId)}
        students={data.students}
        onClose={() => setModals({ type: null, classId: null })}
        onSuccess={fetchData}
      />
      {modals.classId && (
        <CreateStudentModal
          isOpen={modals.type === "new"}
          onClose={() => setModals({ type: null, classId: null })}
          classId={modals.classId}
          onSuccess={fetchData}
        />
      )}
      {modals.classId && (
        <CreateQuestionModal
          isOpen={modals.type === "quest"}
          onClose={() => setModals({ type: null, classId: null })}
          classId={modals.classId}
          onSuccess={fetchData}
        />
      )}
      {modals.classId && (
        <ViewQuestionsModal
          isOpen={modals.type === "view"}
          onClose={() => setModals({ type: null, classId: null })}
          classId={modals.classId}
        />
      )}
    </div>
  );
}

function ClassCard({ cls, onAction, refresh }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Visual Header */}
      <div className="bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Layers size={80} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
              Active Session
            </span>
            <div className="flex -space-x-2">
              {cls.students.slice(0, 3).map((s: any, i: number) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-indigo-500 flex items-center justify-center text-[10px] font-bold"
                >
                  {s.name[0]}
                </div>
              ))}
              {cls.students.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                  +{cls.students.length - 3}
                </div>
              )}
            </div>
          </div>
          <h3 className="text-2xl font-black mb-1">{cls.className}</h3>
          <p className="text-indigo-100 text-sm font-medium">
            {cls.students.length} Students • {cls._count?.questions || 0}{" "}
            Questions
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Student Management
            </p>
            <ActionButton
              icon={UserPlus}
              label="Enroll"
              color="bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              onClick={() => onAction("add")}
            />
            <ActionButton
              icon={Plus}
              label="Create New"
              color="bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              onClick={() => onAction("new")}
            />
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Content Ops
            </p>
            <ActionButton
              icon={MessageSquare}
              label="Add Question"
              color="bg-purple-600 text-white shadow-lg shadow-purple-100"
              onClick={() => onAction("quest")}
            />
            <ActionButton
              icon={Eye}
              label="View Answers"
              color="bg-gray-900 text-white shadow-lg shadow-gray-200"
              onClick={() => onAction("view")}
            />
          </div>
        </div>

        {/* Mini Roster */}
        <div className="pt-6 border-t border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Recent Enrollments
            </p>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {cls.students.map((s: any) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-xs uppercase">
                    {s.name[0]}
                  </div>
                  <p className="text-xs font-bold text-gray-700">{s.name}</p>
                </div>
                <button
                  onClick={async () => {
                    if (confirm("Unenroll student?")) {
                      await fetch(`/api/classes/${cls.id}/students/${s.id}`, {
                        method: "DELETE",
                      });
                      refresh();
                    }
                  }}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionButton = ({ icon: Icon, label, color, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 py-3 px-4 rounded-2xl text-xs font-bold transition-all active:scale-95 ${color}`}
  >
    <Icon size={16} /> {label}
  </button>
);

const EmptyState = () => (
  <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
      <BookOpen size={40} />
    </div>
    <h3 className="text-xl font-black text-gray-900">No Assignments Found</h3>
    <p className="text-gray-500 max-w-xs mx-auto mt-2">
      You currently have no classes assigned to your profile.
    </p>
  </div>
);
