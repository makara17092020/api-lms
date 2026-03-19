"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // This calls your 'authorize' function in lib/auth.ts
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/profile");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-10 space-y-6 border border-slate-200 dark:border-slate-700"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center">
          Sign in to your account
        </h1>

        {error && (
          <p className="text-sm font-medium text-danger/90 bg-danger/10 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary/90 transition">
          Sign In
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          New here?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
