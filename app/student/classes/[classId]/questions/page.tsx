import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  if (!classId) {
    return notFound();
  }

  // 1. Fetch Class Name from database
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    select: { className: true },
  });

  if (!classData) {
    return notFound();
  }

  // 2. Make the ID student-friendly (taking the last 5 characters)
  const friendlyCode = classId.slice(-5).toUpperCase();

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 🔙 BACK BUTTON to Student Dashboard */}
        <div className="flex justify-start">
          <Link
            href="/student"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* HEADER SECTION WITH CLASS NAME */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/40 rounded-2xl">
              <BookOpen
                className="text-violet-600 dark:text-violet-400"
                size={24}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {classData.className}
              </h1>
              {/* CLEAN VERSION OF ID (No more ugly database string) */}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Class Code:{" "}
                <span className="font-mono font-bold tracking-wider text-violet-600 dark:text-violet-400">
                  CLASS-{friendlyCode}
                </span>
              </p>
            </div>
          </div>

          <div className="px-4 py-1.5 self-start md:self-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-wide">
            LIVE QUESTIONS
          </div>
        </header>

        {/* LIST CONTAINER */}
        <section className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
              <HelpCircle className="text-slate-400" size={28} />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            No Questions Dropped Yet
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            When your instructor adds questions for the{" "}
            <strong>{classData.className}</strong> class, they will appear here!
          </p>
        </section>
      </div>
    </div>
  );
}
