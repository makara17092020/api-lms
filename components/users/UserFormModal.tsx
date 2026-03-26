"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import {
  X,
  Loader2,
  UploadCloud,
  UserPlus,
  Save,
  Image as ImageIcon,
} from "lucide-react";

interface UserFormModalProps {
  user: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormModal({
  user,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "STUDENT",
    password: "",
    image: user?.image || "", // Cloudinary secure_url state
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = user ? "PUT" : "POST";
    const url = user ? `/api/users/${user.id}` : "/api/users";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        alert(err.error || "Form submission failed");
      }
    } catch (error) {
      alert("Network Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. Sleek Modern Glassmorphism Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* 2. Responsive Card Modal Context */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-white w-full max-w-md p-6 rounded-2xl shadow-xl z-10 border border-gray-100 overflow-hidden"
      >
        {/* Header Alignment View */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                user
                  ? "bg-amber-50 text-amber-600"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {user ? <Save size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {user ? "Edit Account" : "Add New User"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Fill out system identification constraints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Forms */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cloudinary Integration Structure */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Profile Portrait
            </label>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Profile Preview"
                    width={56}
                    height={56}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <ImageIcon size={20} className="text-gray-400" />
                )}
              </div>

              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                  clientAllowedFormats: ["png", "jpg", "jpeg"],
                }}
                onSuccess={(result: any) => {
                  setFormData({ ...formData, image: result.info.secure_url });
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open?.()}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    <UploadCloud size={14} />
                    {formData.image ? "Change Photo" : "Upload Image"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., John Doe"
              className="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@organization.com"
              className="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              {user ? "Password (optional)" : "Password"}
            </label>
            <input
              required={!user}
              type="password"
              placeholder="••••••••"
              className="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Account Role
            </label>
            <select
              className="w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white cursor-pointer"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="STUDENT">Student (Standard Access)</option>
              <option value="TEACHER">Instructor Permissions</option>
              <option value="SUPER_ADMIN">System Administrator</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : user ? (
                "Update Account"
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
