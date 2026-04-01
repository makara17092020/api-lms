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
    { label: "Total Students", value: totalStudents.toString(), icon: Users, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Active Classes", value: activeClasses.toString(), icon: BookOpen, gradient: "from-purple-500 to-indigo-500", bg: "bg-purple-50", text: "text-purple-600" },
    { label: "Avg. Completion", value: avgCompletion, icon: TrendingUp, gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-600" },
    { label: "Active Exams", value: activeExams.toString(), icon: FileCheck, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className={`rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow ${stat.bg}`}>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-4`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className={`text-sm font-medium ${stat.text}`}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}