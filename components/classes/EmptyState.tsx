"use client";

import { Plus, SearchX } from "lucide-react";

interface EmptyStateProps {
  hasSearchTerm: boolean;
  onCreateClick: () => void;
}

export default function EmptyState({
  hasSearchTerm,
  onCreateClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-2xl text-center p-6 shadow-sm">
      <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
        {hasSearchTerm ? <SearchX size={32} /> : <Plus size={32} />}
      </div>
      <h3 className="text-lg font-bold text-gray-900">
        {hasSearchTerm ? "No classes found" : "No active modules deployed"}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
        {hasSearchTerm
          ? "Check your spelling or filter context parameters."
          : "Kickstart your workspace environment by deploying the first class."}
      </p>

      {!hasSearchTerm && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
        >
          <Plus size={18} />
          Create Class
        </button>
      )}
    </div>
  );
}
