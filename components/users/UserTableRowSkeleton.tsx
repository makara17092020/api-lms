"use client";

export default function UserTableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {/* 1. Profile Picture & User Identity Shimmer */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded-md" />
            <div className="h-3 w-44 bg-gray-100 rounded-md" />
          </div>
        </div>
      </td>

      {/* 2. Role Pill Capsule Shimmer */}
      <td className="px-6 py-4">
        <div className="h-6 w-20 bg-gray-200 rounded-lg" />
      </td>

      {/* 3. Status Bullet Shimmer */}
      <td className="px-6 py-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </td>

      {/* 4. Action Buttons Shimmer */}
      <td className="px-6 py-4">
        <div className="flex justify-end gap-1.5">
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
          <div className="h-8 w-8 bg-gray-200 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}
