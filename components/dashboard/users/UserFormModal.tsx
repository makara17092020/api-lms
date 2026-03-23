"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Loader2, X, UploadCloud, ImageIcon } from "lucide-react";

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
    image: user?.image || "", // 👈 Handles Cloudinary secure_url state
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg border overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">
            {user ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* --- Cloudinary Upload Block --- */}
          <div>
            <label className="text-xs font-semibold text-gray-700">
              Profile Picture
            </label>
            <div className="mt-1.5 flex items-center gap-4">
              {/* Circular Preview Container */}
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Profile Preview"
                    width={64}
                    height={64}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <ImageIcon size={24} className="text-gray-400" />
                )}
              </div>

              {/* Upload Trigger Widget */}
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
                    onClick={() => {
                      // 🛡️ Added safety check: Only fire open if Cloudinary script is ready!
                      if (open) {
                        open();
                      } else {
                        alert(
                          "Cloudinary widget is still loading. Please wait a second and try again.",
                        );
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UploadCloud size={14} />
                    {formData.image ? "Change Photo" : "Upload Photo"}
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          {/* User Fields */}
          <div>
            <label className="text-xs font-semibold text-gray-700">
              Full Name
            </label>
            <input
              required
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">
              Email Address
            </label>
            <input
              required
              type="email"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">
              {user ? "Password (optional)" : "Password"}
            </label>
            <input
              required={!user}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">
              System Role
            </label>
            <select
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white cursor-pointer"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="SUPER_ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex justify-center items-center gap-1.5 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {user ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
