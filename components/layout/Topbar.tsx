"use client";

import { useState, useEffect, useRef } from "react";
import {
  LogOut,
  Bell,
  Loader2,
  User,
  Camera,
  X,
  ChevronDown,
  UserPlus,
  BookOpen,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutModal from "@/components/users/LogoutModal";

interface UserProfile {
  name: string;
  email: string;
  image: string | null;
}

interface NotificationItem {
  id: string;
  type: "PLAN" | "USER";
  message: string;
  time: string;
  link: string;
}

interface TopbarProps {
  title?: string;
  leftContent?: React.ReactNode; // 🟢 Added this to receive the hamburger button
}

export default function Topbar({ title = "Dashboard", leftContent }: TopbarProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // --- YOUR ORIGINAL PROFILE STATES ---
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- NOTIFICATION STATES ---
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // --- YOUR ORIGINAL FETCH PROFILE LOGIC ---
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setProfile(data);
      setEditName(data.name || "");
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- NOTIFICATION FETCH & CLEAR LOGIC ---
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      const allItems: NotificationItem[] = data.notifications || data; 

      const lastCleared = localStorage.getItem("notif_clear_timestamp");
      const clearTime = lastCleared ? new Date(lastCleared).getTime() : 0;

      const freshItems = Array.isArray(allItems)
        ? allItems.filter((item) => new Date(item.time).getTime() > clearTime)
        : [];

      setNotifications(freshItems);
      setUnreadCount(freshItems.length);
    } catch (error) {
      console.error("Notifications fetch error:", error);
    }
  };

  const clearNotificationBadge = () => {
    const now = new Date().toISOString();
    localStorage.setItem("notif_clear_timestamp", now);
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleBellClick = () => {
    if (showNotifications) {
      clearNotificationBadge();
    }
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (link: string) => {
    clearNotificationBadge();
    setShowNotifications(false);
    router.push(link);
  };

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (showNotifications) clearNotificationBadge();
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // --- YOUR ORIGINAL ACTIONS ---
  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsLogoutOpen(false);
        router.push("/");
        router.refresh();
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editName);
      if (editImage) formData.append("image", editImage);
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        await fetchProfile();
        setIsEditModalOpen(false);
        setPreviewUrl(null);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center">
          {/* 🟢 Render Hamburger button here if it exists */}
          {leftContent}
          
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleBellClick}
              className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-60 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-gray-50">
                  <h3 className="font-bold text-gray-900 text-sm">
                    New Activity
                  </h3>
                </div>
                <div className="max-h-100 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n.link)}
                        className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex gap-3 border-b border-gray-50 last:border-0"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === "USER" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
                        >
                          {n.type === "USER" ? (
                            <UserPlus size={16} />
                          ) : (
                            <BookOpen size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-800 font-medium leading-tight">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">New</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Profile Section */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-linear-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white font-bold border border-gray-200">
                {profile?.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">
                  {profile?.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                  User Account
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-60">
                <button
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <User size={16} /> Edit Profile
                </button>
                <div className="h-px bg-gray-50 my-1" />
                <button
                  onClick={() => {
                    setIsLogoutOpen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- REUSABLE LOGOUT MODAL --- */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutLoading}
      />

      {/* --- IN-PAGE EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white bg-purple-100 flex items-center justify-center shadow-md">
                    {previewUrl || profile?.image ? (
                      <img
                        src={previewUrl || (profile?.image as string)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-purple-300" />
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-[#7C3AED] text-white p-2 rounded-xl shadow-lg cursor-pointer hover:bg-purple-700 transition-all">
                    <Camera size={18} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditImage(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:border-purple-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isSaving}
                  type="submit"
                  className="flex-1 py-3 bg-[#7C3AED] text-white rounded-2xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}