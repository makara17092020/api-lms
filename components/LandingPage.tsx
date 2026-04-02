"use client";

import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Bot,
  BarChart3,
  GraduationCap,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
  CheckCircle2,
  Globe,
} from "lucide-react";

// ─── Stagger helpers ─────────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as any },
  },
};

// ─── Hero Mockup ──────────────────────────────────────────────────────────────
function HeroMockup() {
  const t = useTranslations("LandingPage");

  return (
    <div
      className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
      style={{
        background: "#0f0f14",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 40px 80px rgba(99,102,241,0.18), 0 0 0 1px rgba(99,102,241,0.1)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white/90">
              {t("mockupTitle")}
            </p>
            <p className="text-[10px] text-white/30">{t("mockupStatus")}</p>
          </div>
        </div>
        <span
          className="text-[10px] font-semibold px-3 py-1 rounded-full"
          style={{ background: "rgba(52,211,153,0.12)", color: "#34D399" }}
        >
          {t("mockupLive")}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Progress card */}
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex justify-between text-xs mb-3">
            <span className="text-white/60 font-medium">
              {t("mockupProgress")}
            </span>
            <span style={{ color: "#34D399" }} className="font-semibold">
              92%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#34D399,#06B6D4)" }}
              initial={{ width: 0 }}
              animate={{ width: "92%" }}
              transition={{
                duration: 1.4,
                delay: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <span
              className="text-[10px] px-2.5 py-1 rounded-lg text-white/40"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {t("mockupDay")}
            </span>
            <span
              className="text-[10px] px-2.5 py-1 rounded-lg font-medium"
              style={{ background: "rgba(52,211,153,0.1)", color: "#34D399" }}
            >
              {t("mockupNext")}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: t("mockupStreak"),
              value: t("mockupStreakVal"),
              color: "#FCD34D",
            },
            { label: t("mockupMastery"), value: "87%", color: "#A78BFA" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl p-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-[10px] text-white/30 mb-1">{label}</p>
              <p className="text-xl font-bold" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* AI message */}
        <div
          className="rounded-xl p-3 text-[11px] text-white/50 leading-relaxed"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <span style={{ color: "#818CF8" }} className="font-semibold">
            {t("mockupMessageName")}{" "}
          </span>
          {t("mockupMessage")}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const t = useTranslations("LandingPage");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Data moved inside component to access translations
  const FEATURES = [
    {
      icon: Bot,
      accent: "#6366f1",
      bg: "#eef2ff",
      title: t("feature1Title"),
      desc: t("feature1Desc"),
    },
    {
      icon: BarChart3,
      accent: "#0ea5e9",
      bg: "#e0f2fe",
      title: t("feature2Title"),
      desc: t("feature2Desc"),
    },
    {
      icon: GraduationCap,
      accent: "#8b5cf6",
      bg: "#f5f3ff",
      title: t("feature3Title"),
      desc: t("feature3Desc"),
    },
  ];

  const STEPS = [
    {
      num: "01",
      icon: Zap,
      color: "#f59e0b",
      bg: "#fffbeb",
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      num: "02",
      icon: Bot,
      color: "#8b5cf6",
      bg: "#f5f3ff",
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      num: "03",
      icon: TrendingUp,
      color: "#10b981",
      bg: "#ecfdf5",
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
  ];

  const TESTIMONIALS = [
    {
      name: "Sophea Keo",
      role: t("test1Role"),
      text: t("test1Text"),
      stars: 5,
    },
    {
      name: "Mr. Dara Heng",
      role: t("test2Role"),
      text: t("test2Text"),
      stars: 5,
    },
    {
      name: "Bopha Lim",
      role: t("test3Role"),
      text: t("test3Text"),
      stars: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 scroll-smooth">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden"
      >
        {/* Soft background glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(at_top_right,#6366f1_0%,transparent_70%)] opacity-[0.07]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(at_bottom_left,#a855f7_0%,transparent_70%)] opacity-[0.07]" />
        <div className="pointer-events-none absolute left-10 top-20 h-96 w-96 rounded-full bg-indigo-300/10 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-12 h-80 w-80 rounded-full bg-violet-300/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-xl px-5 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-indigo-200">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  {t("heroBadge")}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp} className="space-y-1">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter leading-none text-zinc-900">
                  {t("heroTitle1")}
                </h1>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter leading-none bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {t("heroTitle2")}
                </h1>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="max-w-xl text-xl text-zinc-500 leading-relaxed"
              >
                {t("heroDesc")}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href="/register"
                    className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
                    style={{ height: "52px" }}
                  >
                    {t("startLearningFree")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-8 font-semibold text-zinc-700 hover:bg-zinc-50 transition-all duration-300"
                    style={{ height: "52px" }}
                  >
                    {t("viewFeatures")}
                  </a>
                </motion.div>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-6 text-sm text-zinc-500 pt-2"
              >
                <div className="flex -space-x-3">
                  {["#6366f1", "#8b5cf6", "#a855f7", "#c084fc"].map((c, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full ring-2 ring-white"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <p className="leading-snug text-xs text-zinc-500">
                  {t("trustedBy")}{" "}
                  <span className="font-semibold text-zinc-700">8,400+</span>{" "}
                  {t("students")}
                  <br />
                  {t("andInstitutions")}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  4.9 / 5.0
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hidden lg:flex justify-end"
            >
              <HeroMockup />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-widest text-zinc-400 uppercase">
            {t("scroll")}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="h-8 w-0.5 rounded-full bg-gradient-to-b from-zinc-300 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest bg-indigo-50 text-indigo-600 rounded-full mb-4">
              {t("featuresBadge")}
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">
              {t("featuresTitle")}
            </h2>
            <p className="mt-3 text-zinc-500 max-w-xl mx-auto">
              {t("featuresDesc")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, accent, bg, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ background: bg }}
                >
                  <Icon className="h-6 w-6" style={{ color: accent }} />
                </div>
                <h3 className="font-semibold text-lg text-zinc-900 mb-3">
                  {title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Checklist pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-3 justify-center"
          >
            {[t("pill1"), t("pill2"), t("pill3"), t("pill4"), t("pill5")].map(
              (item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-zinc-600 bg-zinc-50 border border-zinc-200"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {item}
                </span>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-zinc-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest bg-violet-50 text-violet-600 rounded-full mb-4">
              {t("howBadge")}
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">
              {t("howTitle")}
            </h2>
            <p className="mt-3 text-zinc-500">{t("howDesc")}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({ num, icon: Icon, color, bg, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                className="group bg-white rounded-3xl p-8 border border-zinc-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="text-6xl font-bold text-zinc-100 group-hover:text-indigo-100 transition-colors leading-none">
                    {num}
                  </div>
                  <div
                    className="h-12 w-12 flex items-center justify-center rounded-2xl group-hover:rotate-12 transition-transform"
                    style={{ background: bg }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-zinc-900 mb-2">
                  {title}
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest bg-amber-50 text-amber-600 rounded-full mb-4">
              {t("testimonialsBadge")}
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">
              {t("testimonialsTitle")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, stars }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-white border border-zinc-100 rounded-3xl p-7 flex flex-col gap-5 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1">
                  {Array.from({ length: stars }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-current text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed flex-1">
                  "{text}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium bg-white/10 text-white/80 border border-white/20">
              <Globe className="h-3 w-3" />
              {t("ctaBadge")}
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              {t("ctaTitle")}
            </h2>
            <p className="text-lg text-white/80">{t("ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white text-zinc-900 px-10 font-semibold shadow-xl hover:shadow-white/20 transition-all"
                  style={{ height: "52px" }}
                >
                  {t("getStartedFree")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 text-white px-8 font-medium hover:bg-white/10 transition-all"
                  style={{ height: "52px" }}
                >
                  {t("signIn")}
                </Link>
              </motion.div>
            </div>
            <p className="text-xs text-white/40">{t("noCreditCard")}</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
