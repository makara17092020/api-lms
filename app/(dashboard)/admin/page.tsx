"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Mail,
  Loader2,
  Users,
  GraduationCap,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import UserFormModal from "@/components/dashboard/users/UserFormModal"; // 👈 Your exact modal file path!

// 1. Standard Typescript interfaces for local usage
type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
  createdAt: string;
}

interface DashboardMetrics {
  totalUsers: number;
  students: number;
  teachers: number;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    students: 0,
    teachers: 0,
  });
  const [loading, setLoading] = useState(true);

  // Search, Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetching live metrics and users from your Prisma API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();

      if (data.users && data.metrics) {
        setUsers(data.users);
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Failed to fetch users from real-time endpoints", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? It will wipe relational data.",
      )
    )
      return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers(); // Refresh the table and counts instantly
      } else {
        const err = await res.json();
        alert(err.error || "Delete operation failed.");
      }
    } catch (error) {
      alert("Network connectivity error during deletion.");
    }
  };

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Client-side search and filtering
  const filteredUsers = useMemo(() => {
    setCurrentPage(1); // Auto-reset to page 1 on search
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Splicing limits for exact Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-6">
      {/* --- Page Header Titles --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Users Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View platform usage weights and modify access scopes.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm active:scale-95"
        >
          <Plus size={16} /> Add user
        </button>
      </div>

      {/* --- LIVE DATABASE STATS (Dynamic Counters) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Platform Users"
          value={metrics.totalUsers}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Enrolled Students"
          value={metrics.students}
          icon={GraduationCap}
          color="emerald"
        />
        <StatCard
          title="Active Teachers"
          value={metrics.teachers}
          icon={Briefcase}
          color="amber"
        />
      </div>

      {/* --- SEARCH AND FILTERS BAR --- */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-lg text-sm outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium cursor-pointer"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Admin</option>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
        </select>
      </div>

      {/* --- USERS TABLE VIEW --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                      <Loader2 className="animate-spin" size={24} />
                      <p className="text-sm">Pulling user indices from DB...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-sm text-gray-500"
                  >
                    No matching accounts found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* User Details with Cloudinary Real-Image Fallback mechanism */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Profile Image Container */}
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm overflow-hidden border border-gray-200">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || "User"}
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            user.name?.charAt(0).toUpperCase() || "U"
                          )}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name || "Anonymous User"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-gray-100 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        {user.role !== "SUPER_ADMIN" && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- DYNAMIC PAGINATION FOOTER --- */}
        {!loading && filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, filteredUsers.length)}
              </span>{" "}
              of <span className="font-medium">{filteredUsers.length}</span>{" "}
              results
            </div>
            <div className="flex flex-1 justify-end items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-medium text-gray-700">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- FORM MODAL TRIGGER (Save or Edit) --- */}
      {isModalOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            window.location.reload(); // Live reload metrics contexts on successful submissions
          }}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------
// Sub-Components local visual style states
// -----------------------------------------------------------

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  const colorSchemes: any = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl border ${colorSchemes[color]}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles = {
    SUPER_ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
    TEACHER: "bg-blue-50 text-blue-700 border-blue-200",
    STUDENT: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[role]}`}
    >
      {role === "SUPER_ADMIN"
        ? "Admin"
        : role.charAt(0) + role.slice(1).toLowerCase()}
    </span>
  );
}
