"use client";

import { useState, useEffect } from "react";
import { LogOut, Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutModal from "@/components/users/LogoutModal"; // 👈 Import new modal

export default function Topbar() {
  const router = useRouter();

  const [admin, setAdmin] = useState<{
    name: string;
    role: string;
    image: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 🚪 Popup and Action states
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setAdmin({
          name: data.name || "Chantha Makara",
          role: data.role || "Super Admin",
          image: data.image || null,
        });
      } catch (error) {
        console.error("Failed to load topbar admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [router]);

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

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <>
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">Workspace /</span>
          <span className="text-sm font-semibold text-gray-900">Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <Bell size={18} />
          </button>

          <div className="h-6 w-px bg-gray-200" />

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-9 flex items-center justify-center">
                <Loader2 size={18} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden border border-gray-200">
                {admin?.image ? (
                  <img
                    src={admin.image}
                    alt={admin.name}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  getInitials(admin?.name || "C")
                )}
              </div>
            )}

            <div className="hidden md:block">
              {loading ? (
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-2 w-16 bg-gray-100 animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-900">
                    {admin?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {admin?.role?.toLowerCase().replace("_", " ")}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-gray-200" />

          <button
            onClick={() => setIsLogoutOpen(true)} // 👈 Hooks into state instead of confirm()
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95 group"
          >
            <LogOut
              size={18}
              className="text-red-500 group-hover:text-red-600 transition-colors"
            />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Modern Pop Up Overlay Mounted Portal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutLoading}
      />
    </>
  );
}
