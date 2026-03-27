"use client";

import { Edit, Trash2 } from "lucide-react";
import { User, UserRole } from "@/app/(dashboard)/admin/users/page";

interface UserTableRowProps {
  user: User;
  onEdit: () => void;
  onDeleteClick: () => void; // 👈 Updated this prop name
}

export default function UserTableRow({
  user,
  onEdit,
  onDeleteClick,
}: UserTableRowProps) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold overflow-hidden border border-gray-200">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="object-cover h-full w-full"
              />
            ) : (
              user.name?.charAt(0).toUpperCase() || "N"
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          Active
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1.5">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Edit size={16} />
          </button>

          {/* 🛑 Don't let Admins delete themselves */}
          {user.role !== "SUPER_ADMIN" && (
            <button
              onClick={onDeleteClick} // 👈 Clicking this triggers the parent's modern popup!
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles = {
    SUPER_ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
    TEACHER: "bg-amber-50 text-amber-700 border-amber-200",
    STUDENT: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[role]}`}
    >
      {role === "SUPER_ADMIN" ? "Admin" : role}
    </span>
  );
}
