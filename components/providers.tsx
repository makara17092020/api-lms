"use client";

export default function Providers({ children }: { children: React.ReactNode }) {
  // We removed SessionProvider so it no longer polls /api/auth/session
  return <>{children}</>;
}
