"use client";

import { LogOut, Bell } from "lucide-react";

interface TopbarProps {
  adminName?: string;
  adminRole?: string;
  adminImage?: string | null;
}

export default function Topbar({
  adminName = "Chantha Makara",
  adminRole = "Super Admin",
  adminImage = null,
}: TopbarProps) {
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      // Add NextAuth signOut() or your logic here
      window.location.href = "/login";
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      {/* Left Side: Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400">Workspace /</span>
        <span className="text-sm font-semibold text-gray-900">Dashboard</span>
      </div>

      {/* Right Side: Notifications, Profile, and Logout */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
          <Bell size={18} />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Profile Avatar & Info */}
        <div className="flex items-center gap-3">
          {/* 👈 Dynamic Avatar with standard HTML Img tag */}
          <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden border border-gray-200">
            {adminImage ? (
              <img
                src={adminImage}
                alt={adminName}
                className="object-cover h-full w-full h-9 w-9"
              />
            ) : (
              adminName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">{adminName}</p>
            <p className="text-xs text-gray-500">{adminRole}</p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
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
  );
}
