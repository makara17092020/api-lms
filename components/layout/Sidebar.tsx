"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BrainCircuit,
  LogOut,
  RefreshCw,
  X, // Added X icon to close
} from "lucide-react";
import LogoutModal from "@/components/users/LogoutModal";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Close sidebar automatically when the route changes (on mobile)
  useEffect(() => {
    if (onClose) onClose();
  }, [pathname]);

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const isAdmin = pathWithoutLocale.startsWith("/admin");
  const isTeacher = pathWithoutLocale.startsWith("/teacher");
  const baseRoute = isAdmin ? "/admin" : isTeacher ? "/teacher" : "/student";

  const menuItems = [
    { name: "Dashboard", href: `/${locale}${baseRoute}`, icon: LayoutDashboard, hide: isTeacher },
    { name: "Users", href: `/${locale}/admin/users`, icon: Users, hide: !isAdmin },
    { name: "Class", href: isAdmin ? `/${locale}/admin/classes` : `/${locale}${baseRoute}`, icon: BookOpen },
    { name: "Study Plans", href: `/${locale}/admin/study-plans`, icon: BrainCircuit, hide: !isAdmin },
    ...(isTeacher
      ? [
          { name: "Student", href: `/${locale}/teacher/students`, icon: Users },
          { name: "Study Plans", href: `/${locale}/teacher/plans`, icon: BrainCircuit },
        ]
      : []),
  ];

  const handleUIRefresh = () => {
    setIsRefreshing(true);
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
        router.push(`/${locale}/login`);
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = `/${locale}/login`;
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      {/* 🟢 1. Mobile Overlay: Dims the screen when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 🟢 2. Sidebar Container: Added responsive transition classes */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white flex flex-col h-full shadow-xl transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-sm
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            AI Academy
          </span>

          <div className="flex items-center gap-1">
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
            
            {/* 🟢 3. Close Button: Only visible on mobile */}
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.hide) return null;
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
                  className={isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
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
            <LogOut size={18} className="text-gray-400 group-hover:text-red-600 transition-colors" />
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