"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

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

export default function CompleteProfilePage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.needsCompletion === false) {
      // User already completed profile, redirect to dashboard
      redirectToDashboard(session.user.role);
      return;
    }

    // Pre-fill name from session if available
    if (session.user.name) {
      setName(session.user.name);
    }
  }, [session, status, router]);

  const redirectToDashboard = (role: string) => {
    if (role === "SUPER_ADMIN") {
      router.push("/admin");
    } else if (role === "TEACHER") {
      router.push("/teacher");
    } else {
      router.push("/student");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name.trim() || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete profile");
      }

      // Redirect to dashboard based on role
      redirectToDashboard(data.user.role);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

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
                  Complete your profile
                </h1>
                <p className="text-gray-500 mt-1 text-lg">
                  Just a few more details to get started
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
                {/* Full Name */}
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

                {/* Password */}
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
                        <Loader2 className="animate-spin" size={20} /> Completing...
                      </>
                    ) : (
                      "Complete Profile"
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-0" />
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* ILLUSTRATION SIDE */}
        <div className="hidden lg:flex flex-1 lg:w-7/12 relative overflow-hidden bg-linear-to-br from-indigo-950 via-violet-950 to-indigo-950">
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
        </div>
      </motion.div>
    </div>
  );
}