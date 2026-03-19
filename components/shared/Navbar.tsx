"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80 transition">
              AI-LMS
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {status === "loading" ? (
              <div className="h-8 w-20 bg-slate-200/70 dark:bg-slate-700/70 animate-pulse rounded-lg"></div>
            ) : session ? (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-300 hidden lg:block">
                  Hi,{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {session.user?.name}
                  </span>
                </span>
                <Link
                  href={`/dashboard/${session.user?.role?.toLowerCase()}`}
                  className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition"
                >
                  Profile
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => signOut()}
                  className="bg-danger text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-danger/90 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <Link
                  href="/login"
                  className="text-slate-600 dark:text-slate-200 hover:text-primary text-sm font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4">
            <div className="flex flex-col gap-4">
              {status === "loading" ? (
                <div className="h-8 w-20 bg-slate-200/70 dark:bg-slate-700/70 animate-pulse rounded-lg"></div>
              ) : session ? (
                <>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Hi,{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {session.user?.name}
                    </span>
                  </span>
                  <Link
                    href={`/dashboard/${session.user?.role?.toLowerCase()}`}
                    className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="bg-danger text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-danger/90 transition w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-600 dark:text-slate-200 hover:text-primary text-sm font-medium transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
