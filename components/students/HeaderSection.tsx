"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";

import ProfileAvatar from "./ProfileAvatar";
import ProfileDropdown from "./ProfileDropdown";
import EditProfileModal from "./EditProfileModal";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface Props {
  studyPlanCount: number;
  onMenuToggle: (isOpen: boolean) => void;
}

export default function HeaderSection({ studyPlanCount, onMenuToggle }: Props) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Blur page if dropdown OR modal is active
  useEffect(() => {
    onMenuToggle(dropdownOpen || modalOpen);
  }, [dropdownOpen, modalOpen, onMenuToggle]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong during logout.");
    }
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleEditProfile = () => {
    setDropdownOpen(false); // Close dropdown so it doesn't overlap
    setModalOpen(true);
  };

  return (
    <header className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 rounded-3xl px-5 py-5 md:px-8 shadow-sm">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center bg-linear-to-br from-violet-500 to-fuchsia-500 text-white rounded-3xl shadow-inner">
          <GraduationCap size={24} strokeWidth={2.75} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Student Hub
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
            Your learning dashboard
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* All Plans Button */}
        <Link
          href="/student/plans"
          className="flex items-center gap-2 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:border-violet-300 transition-colors active:scale-95 flex-1 sm:flex-none justify-center sm:justify-start"
        >
          <BookOpen size={18} />
          <span className="hidden sm:inline">All Plans</span>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 text-xs font-bold">
            {studyPlanCount}
          </span>
        </Link>

        {/* Profile Avatar + Dropdown */}
        <div className="relative">
          <ProfileAvatar
            user={user}
            loading={loadingUser}
            onClick={() => setDropdownOpen((prev) => !prev)}
          />

          <ProfileDropdown
            isOpen={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            user={user}
            onEditProfile={handleEditProfile}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Contextual Edit Profile Modal */}
      <EditProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        onUserUpdated={handleUserUpdated}
      />
    </header>
  );
}
