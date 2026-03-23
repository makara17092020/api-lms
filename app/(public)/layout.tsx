import Navbar from "@/components/shared/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar /> {/* Shows ONLY on landing pages, about us, etc. */}
      <main>{children}</main>
    </>
  );
}
