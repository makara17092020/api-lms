// app/(public)/layout.tsx
import Navbar from "@/components/shared/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />{" "}
      {/* ✅ Navbar only renders for the homepage and public pages! */}
      <main className="min-h-screen bg-white">{children}</main>
    </>
  );
}
