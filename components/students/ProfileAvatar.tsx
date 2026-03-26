"use client";

import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null; // Fixed: using "image" instead of "avatar"
}

interface Props {
  user: User | null;
  loading: boolean;
  onClick: () => void;
}

export default function ProfileAvatar({ user, loading, onClick }: Props) {
  // Robust initials generator
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
    <button
      onClick={onClick}
      className="flex items-center gap-x-3 group focus:outline-none"
      disabled={loading}
    >
      {/* Avatar Ring */}
      <div className="relative h-10 w-10 shrink-0 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden bg-slate-100 dark:bg-slate-800 transition-all group-hover:ring-violet-400 dark:group-hover:ring-violet-500">
        {loading ? (
          <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
        ) : user?.image ? ( // Fixed from user.avatar to user.image
          <Image
            src={user.image}
            alt={user.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-violet-500 to-fuchsia-500 text-white text-sm font-bold">
            {initials}
          </div>
        )}
      </div>

      {/* Name representation */}
      {user && !loading && (
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {user.name}
          </p>
        </div>
      )}
    </button>
  );
}
