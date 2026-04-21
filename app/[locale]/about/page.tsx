"use client";

import { useTranslations } from "next-intl";
import { BrainCircuit, Target, Users2 } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          {t("title") || "Empowering the Next Generation of Developers"}
        </h1>
        <p className="mt-6 text-zinc-600 max-w-2xl mx-auto text-lg">
          {t("description") || "We combine cutting-edge AI technology with modern pedagogical methods to create a truly personalized learning experience."}
        </p>
      </section>

      {/* Values Grid */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
            <BrainCircuit className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("aiDriven") || "AI-Driven"}</h3>
            <p className="text-zinc-500">{t("aiDesc") || "Our adaptive learning systems adjust to your unique pace and style."}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
            <Users2 className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("community") || "Community"}</h3>
            <p className="text-zinc-500">{t("communityDesc") || "Join thousands of students learning and building together."}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
            <Target className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("results") || "Results"}</h3>
            <p className="text-zinc-500">{t("resultsDesc") || "Focus on practical skills that get you hired in the modern tech market."}</p>
          </div>
        </div>
      </section>
    </main>
  );
}