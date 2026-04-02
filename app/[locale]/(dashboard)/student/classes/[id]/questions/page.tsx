"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuestionsSection from "@/components/students/QuestionsSection";

export default function ClassQuestionsPage() {
  const params = useParams();
  const locale = useLocale();
  const classId = params.id as string;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* --- ADDED BACK BUTTON --- */}
      <div className="mb-6">
        <Link
          href={`/${locale}/student`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
        >
          <div className="p-2 rounded-full bg-white shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Dashboard
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Class Learning Path
        </h1>
        <p className="text-gray-500">
          Complete the questions dropped by your teacher.
        </p>
      </header>

      <QuestionsSection classId={classId} />
    </div>
  );
}
