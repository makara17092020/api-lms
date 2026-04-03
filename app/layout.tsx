// app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Do NOT include <html> or <body> tags here
  return children;
}
