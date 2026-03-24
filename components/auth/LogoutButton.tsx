"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // 1. Call your CUSTOM logout API route
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // 2. Clear client-side cache and redirect to login
        router.push("/login");
        router.refresh();
      } else {
        console.error("Logout failed on server");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="mt-6 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition duration-200"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Signing out...
        </>
      ) : (
        <>
          <LogOut size={18} />
          Sign Out
        </>
      )}
    </button>
  );
}
