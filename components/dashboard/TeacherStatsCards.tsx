// app/components/dashboard/TeacherStatsCards.tsx
import { Users, BookOpen, TrendingUp, FileCheck } from "lucide-react";

type TeacherStatsCardsProps = {
  totalStudents: number;
  activeClasses: number;
  avgCompletion: string;
  activeExams: number;
};

export default function TeacherStatsCards({
  totalStudents,
  activeClasses,
  avgCompletion,
  activeExams,
}: TeacherStatsCardsProps) {
  const stats = [
    { label: "Total Students", value: totalStudents.toString(), icon: Users, color: "bg-blue-500" },
    { label: "Active Classes", value: activeClasses.toString(), icon: BookOpen, color: "bg-purple-500" },
    { label: "Avg. Completion", value: avgCompletion, icon: TrendingUp, color: "bg-pink-500" },
    { label: "Active Exams", value: activeExams.toString(), icon: FileCheck, color: "bg-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}