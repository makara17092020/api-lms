"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

// ===================== UNIFIED ANIMATION CONFIG =====================
const EASE = cubicBezier(0.23, 1, 0.32, 1);

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard/student");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    await signIn("google", {
      callbackUrl: `${window.location.origin}/`,
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-slate-100 flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row-reverse overflow-hidden rounded-3xl bg-white shadow-2xl border border-white/60"
      >
        {/* FORM SIDE */}
        <motion.div
          variants={cardVariants}
          className="flex-1 lg:w-5/12 bg-white/95 backdrop-blur-3xl p-10 lg:p-16 flex items-center justify-center border-l border-white/40"
        >
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-12 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.9, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30"
              >
                <GraduationCap size={32} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ease: EASE }}
              >
                <h1 className="text-4xl font-semibold tracking-tighter text-gray-950">
                  Create account
                </h1>
                <p className="text-gray-500 mt-1 text-lg">
                  Join thousands mastering skills with AI
                </p>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100"
                >
                  <AlertCircle size={22} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="relative">
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded-3xl border border-gray-200 bg-white px-5 py-5 pl-12 text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/70 outline-none transition-all duration-300"
                  />
                  <User
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500 transition-colors"
                    size={22}
                  />
                  <label
                    htmlFor="name"
                    className="pointer-events-none absolute left-12 top-5 text-lg text-gray-500 transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-indigo-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-indigo-600"
                  >
                    Full name
                  </label>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded-3xl border border-gray-200 bg-white px-5 py-5 pl-12 text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/70 outline-none transition-all duration-300"
                  />
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500 transition-colors"
                    size={22}
                  />
                  <label
                    htmlFor="email"
                    className="pointer-events-none absolute left-12 top-5 text-lg text-gray-500 transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-indigo-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-indigo-600"
                  >
                    Email address
                  </label>
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded-3xl border border-gray-200 bg-white px-5 py-5 pl-12 pr-12 text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/70 outline-none transition-all duration-300"
                  />
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-500 transition-colors"
                    size={22}
                  />
                  <label
                    htmlFor="password"
                    className="pointer-events-none absolute left-12 top-5 text-lg text-gray-500 transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-indigo-600 peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-indigo-600"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative w-full overflow-hidden rounded-3xl bg-linear-to-r from-indigo-500 to-violet-600 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />{" "}
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-0" />
                </motion.button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <div className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium tracking-widest text-center">
                  OR CONTINUE WITH
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, ease: EASE }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-14 flex items-center justify-center rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <FcGoogle size={24} />
              </motion.button>
            </motion.div>

            <div className="mt-10 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ILLUSTRATION SIDE */}
        <div className="hidden lg:flex flex-1 lg:w-7/12 relative overflow-hidden bg-linear-to-br from-indigo-950 via-violet-950 to-indigo-950">
          {/* --- UPDATED BACK TO HOME BUTTON --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            className="absolute top-8 left-8 z-20"
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-black/20 hover:bg-black/30 backdrop-blur-xl text-white font-semibold text-xs rounded-full border border-white/10 shadow-lg transition-all active:scale-95 group"
            >
              <ArrowLeft
                size={14}
                className="text-white/90 group-hover:text-white group-hover:-translate-x-0.5 transition-transform"
              />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src="/hero-illustration.png"
              alt="Hero"
              fill
              className="object-cover opacity-70"
              priority
            />
          </motion.div>

          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

          <div className="absolute bottom-16 left-16 max-w-md text-white">
            <h2 className="text-5xl font-semibold tracking-tighter leading-none">
              Start your <span className="text-violet-300">journey</span>
            </h2>
            <p className="mt-6 text-xl text-white/80">
              Join the most delightful AI-powered learning experience.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
