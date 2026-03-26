"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedLength: number;
  filteredLength: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  paginatedLength,
  filteredLength,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">{paginatedLength}</span>{" "}
        of <span className="font-semibold text-gray-900">{filteredLength}</span>{" "}
        users
      </p>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 border border-gray-200 bg-white rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 border border-gray-200 bg-white rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
