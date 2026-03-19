"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold text-blue-600">
          AI-LMS
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-lg"></div>
        ) : session ? (
          <>
            <span className="text-sm text-gray-600 hidden md:block">
              Hi,{" "}
              <span className="font-semibold text-black">
                {session.user?.name}
              </span>
            </span>
            <Link
              href={`/dashboard/${session.user?.role?.toLowerCase()}`}
              className="text-sm font-medium hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
            >
              Sign Out
            </button>
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
