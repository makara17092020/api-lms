"use client";

import { useState, useEffect, useRef } from "react";
import {
  LogOut,
  Bell,
  Loader2,
  Zap,
  User,
  Camera,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutModal from "@/components/users/LogoutModal";

interface UserProfile {
  name: string;
  email: string;
  image: string | null;
}

export default function Topbar({ title = "Dashboard" }: { title?: string }) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Profile Data State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // UI Toggle States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
  }, []);

  // --- LOGOUT LOGIC ---
  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    try {
      // This hits your actual backend route to clear the cookie/token
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

  // --- UPDATE PROFILE LOGIC ---
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
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
            >
              <Bell size={20} />
            </button>
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
                  Super Admin
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${showProfileMenu ? "rotate-180" : ""}`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-60 animate-in fade-in slide-in-from-top-2">
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Edit Admin Profile
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
