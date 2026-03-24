// app/layout.tsx
import Providers from "@/components/providers";
import "./globals.css";

export const metadata = {
  title: "AI-LMS",
  description: "An AI-powered Learning Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
