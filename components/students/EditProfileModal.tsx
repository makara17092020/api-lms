"use client";

import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  onUserUpdated: (updatedUser: User) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}: Props) {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || "");
      setPreviewUrl(user.image || null);
      setAvatarFile(null);
    }
  }, [isOpen, user]);

  // Handle keyboard Accessibility
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setSaving(true);

    const formData = new FormData();
    formData.append("name", name);
    if (avatarFile) formData.append("image", avatarFile);

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const updatedUser: User = await res.json();
        onUserUpdated(updatedUser);
        onClose();
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && user && (
        <>
          {/* Subtle Invisible Backdrop just to catch click-outside closures without darkening the header */}
          <div className="fixed inset-0 z-140" onClick={onClose} />

          {/* Wrapper pins the modal to top-right under the avatar */}
          <div className="fixed inset-0 z-150 flex justify-end items-start pt-24 px-4 md:px-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-sm rounded-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.2)] overflow-hidden pointer-events-auto origin-top-right"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Edit Profile
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl border-2 border-white dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-2xl font-bold bg-linear-to-br from-violet-500 to-fuchsia-500 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <label className="absolute bottom-0 right-0 cursor-pointer flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 dark:text-white transition-all text-sm font-medium"
                    required
                  />
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-slate-400 cursor-not-allowed text-sm font-medium"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all active:scale-[0.98] shadow-md shadow-indigo-600/20 text-sm"
                >
                  {saving ? "Saving changes..." : "Save Changes"}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
