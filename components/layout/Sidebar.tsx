"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BrainCircuit,
  LogOut,
} from "lucide-react";

// 1. Menu Config for Easy Customization
const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Classes", href: "/admin/classes", icon: BookOpen },
  { name: "Study Plans", href: "/admin/study-plans", icon: BrainCircuit },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-full sticky top-0 z-10 shadow-sm">
      {/* App Branding Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent tracking-tight">
          AI Academy
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => {
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

      {/* Bottom Profile/Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex w-full items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group">
          <LogOut
            size={18}
            className="text-gray-400 group-hover:text-red-600 transition-colors"
          />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
