// app/(dashboard)/admin/layout.tsx
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      {/* 1. Left Fixed Navigation Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-gray-200 bg-white">
        <Sidebar />
      </aside>

      {/* 2. Main Scrollable Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
