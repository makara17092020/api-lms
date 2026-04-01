"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BrainCircuit,
  LogOut,
  RefreshCw,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import LogoutModal from "@/components/users/LogoutModal";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🚪 Popup and Action states
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // 📂 Determine the base route based on current path
  const isAdmin = pathname.startsWith("/admin");
  const isTeacher = pathname.startsWith("/teacher");
  const baseRoute = isAdmin ? "/admin" : isTeacher ? "/teacher" : "/student";

  // Dynamic menu items routing
  const menuItems = [
    {
      name: "Dashboard",
      href: baseRoute,
      icon: LayoutDashboard,
    },
    { name: "Users", href: "/admin/users", icon: Users, hide: !isAdmin }, // Hide users panel if not admin
    {
      name: "Classes",
      href: isAdmin ? "/admin/classes" : `${baseRoute}/classes`,
      icon: BookOpen,
    },
    {
      name: "Study Plans",
      href: isAdmin ? "/admin/study-plans" : `${baseRoute}/study-plans`,
      icon: BrainCircuit,
    },
    // Teacher-only inline dashboard tabs in same menu area
    ...(isTeacher
      ? [
          { name: "Students", href: "/teacher?tab=students", icon: Users },
          { name: "Progress", href: "/teacher?tab=progress", icon: TrendingUp },
          { name: "Exams", href: "/teacher?tab=exams", icon: FileCheck },
        ]
      : []),
  ];

  const handleUIRefresh = () => {
    setIsRefreshing(true);

    // 📢 Broadcast event to tell pages to show skeletons
    window.dispatchEvent(new Event("trigger-dashboard-refresh"));

    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleConfirmLogout = async () => {
    setLogoutLoading(true);

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsLogoutOpen(false);
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-full sticky top-0 z-10 shadow-sm">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            AI Academy
          </span>

          {/* Sleek Visual Refresh Button */}
          <button
            onClick={handleUIRefresh}
            disabled={isRefreshing}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors disabled:opacity-50"
            title="Reload system data"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin text-indigo-600" : ""}
            />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            if (item.hide) return null; // 👈 Checks if it should hide on context (e.g., student view hide admin controls)

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
          >
            <LogOut
              size={18}
              className="text-gray-400 group-hover:text-red-600 transition-colors"
            />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutLoading}
      />
    </>
  );
}
