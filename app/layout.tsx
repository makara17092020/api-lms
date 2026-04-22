// app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children WITHOUT html/body tags to avoid nesting
  return children;
}
