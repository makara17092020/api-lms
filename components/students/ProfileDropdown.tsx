"use client";

import { useEffect, useRef } from "react";
import { Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl"; // 1. Added import

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEditProfile: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({
  isOpen,
  onClose,
  user,
  onEditProfile,
  onLogout,
}: Props) {
  const t = useTranslations("Profile"); // 2. Initialized translations
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="absolute right-0 top-14 z-110 w-64 origin-top-right rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          {/* User header */}
          <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-x-3 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                initials
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="p-1.5">
            {/* Edit Profile */}
            <button
              onClick={() => {
                onClose();
                onEditProfile();
              }}
              className="w-full flex items-center gap-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-slate-300 text-left"
            >
              <Settings size={18} className="text-slate-400" />
              <span className="font-medium text-sm">{t("editProfile")}</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center gap-x-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-left"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">{t("logout")}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
