"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "outline";
}

export default function LogoutButton({ className = "", variant = "default" }: LogoutButtonProps) {
  const baseClasses = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition";

  const variantClasses = variant === "outline"
    ? "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
    : "bg-danger text-white hover:bg-danger/90";

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
