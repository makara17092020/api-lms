// app/components/layout/Topbar.tsx
"use client";

import { useState, useEffect } from "react";
import { LogOut, Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutModal from "@/components/users/LogoutModal";

interface UserProfile {
  name: string;
  role: string;
  image: string | null;
}

export default function Topbar({ title = "Dashboard" }: { title?: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Fetch profile using your custom /api/auth/me
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setProfile({
          name: data.name || "User",
          role: data.role || "Teacher",
          image: data.image || null,
        });
      } catch (error) {
        console.error("Failed to load profile in Topbar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsLogoutOpen(false);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const getInitials = (name: string) => name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50 shadow-sm">
        {/* Left Side - Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button className="p-2.5 text-gray-400 hover:text-[#7C3AED] hover:bg-purple-50 rounded-2xl transition-all">
            <Bell size={20} />
          </button>

          <div className="h-6 w-px bg-gray-200" />

          {/* Profile Section */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-9 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg">
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(profile?.name || "")
                  )}
                </div>

                {/* Name & Role */}
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {profile?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {profile?.role?.toLowerCase().replace("_", " ") || "Teacher"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Logout Button */}
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutLoading}
      />
    </>
  );
}