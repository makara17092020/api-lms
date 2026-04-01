// components/shared/Navbar.tsx
"use client";

import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Navbar() {
  const isLoggedIn = false;
  const userName = "Student";
  const userRole = "student";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-x-2 transition-transform hover:scale-[1.03]"
          >
            <span className="font-bold text-3xl tracking-tighter bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              AI-LMS
            </span>
          </Link>

          {/* Right side - Auth / User */}
          <div className="flex items-center gap-x-4">
            {isLoggedIn ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-x-3">
                  {/* Avatar */}
                  <div className="h-8 w-8 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
                    {initial}
                  </div>

                  {/* Name */}
                  <div className="hidden sm:block">
                    <span className="text-sm font-medium text-zinc-700">
                      Hi, {userName}
                    </span>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link
                  href={`/dashboard/${userRole}`}
                  className="text-sm font-medium px-5 py-2 rounded-3xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                >
                  Dashboard
                </Link>

                <LogoutButton />
              </>
            ) : (
              <>
                {/* Sign In */}
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-5 py-2 transition-colors"
                >
                  Sign in
                </Link>

                {/* Get Started */}
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-3xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
