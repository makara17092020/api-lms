"use client";

import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Navbar() {
  const isLoggedIn = false;
  const userName = "Student";
  const userRole = "student";

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold text-blue-600">
          AI-LMS
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* We removed the 'loading' status check for now since we aren't fetching a session yet */}
        {isLoggedIn ? (
          <>
            <span className="text-sm text-gray-600 hidden md:block">
              Hi, <span className="font-semibold text-black">{userName}</span>
            </span>
            <Link
              href={`/dashboard/${userRole}`}
              className="text-sm font-medium hover:text-blue-600 transition"
            >
              Dashboard
            </Link>

            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
