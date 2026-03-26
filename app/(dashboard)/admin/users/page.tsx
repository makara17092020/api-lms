"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import UserTableRow from "@/components/users/UserTableRow";
import UserTableRowSkeleton from "@/components/users/UserTableRowSkeleton"; // 👈 Pulling it in!
import UserFormModal from "@/components/users/UserFormModal";
import Pagination from "@/components/users/Pagination";
import ConfirmModal from "@/components/users/ConfirmModal";

export type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
  createdAt: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchUsers();

    // 📡 Listener for side effects triggered by Workspace Refresh
    const handleRefreshEvent = () => fetchUsers();
    window.addEventListener("trigger-dashboard-refresh", handleRefreshEvent);

    return () =>
      window.removeEventListener(
        "trigger-dashboard-refresh",
        handleRefreshEvent,
      );
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeletePrompt = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeletePrompt = () => {
    if (deleteLoading) return;
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/users/${userToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUsers();
        handleCloseDeletePrompt();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete network error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header View */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all registered students, teachers, and administrators.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setIsFormModalOpen(true);
          }}
          className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* Global Search & Filtration Mechanisms */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10 transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 outline-none cursor-pointer focus:bg-white"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TEACHER">Teachers</option>
          <option value="SUPER_ADMIN">Admins</option>
        </select>
      </div>

      {/* Table Interface View */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  User Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // 🔄 Swap single loading icon with an array of Skeletons!
                Array.from({ length: 5 }).map((_, idx) => (
                  <UserTableRowSkeleton key={idx} />
                ))
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-gray-400 text-sm"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onEdit={() => {
                      setSelectedUser(user);
                      setIsFormModalOpen(true);
                    }}
                    onDeleteClick={() => handleOpenDeletePrompt(user.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          paginatedLength={paginatedUsers.length}
          filteredLength={filteredUsers.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <AnimatePresence>
        {isFormModalOpen && (
          <UserFormModal
            user={selectedUser}
            onClose={() => setIsFormModalOpen(false)}
            onSuccess={() => {
              setIsFormModalOpen(false);
              fetchUsers();
            }}
          />
        )}

        {isDeleteModalOpen && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeletePrompt}
            onConfirm={handleConfirmDelete}
            loading={deleteLoading}
            title="Delete User"
            description="Are you sure you want to delete this user? This action cannot be undone."
            confirmText="Yes, Delete"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
