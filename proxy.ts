// middleware.ts  (at project root, next to package.json)
import { auth } from "@/lib/auth"; // ← correct import (lowercase auth.ts)
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // Use the auth wrapper to get session + extend req with .auth
  const session = auth(req); // ← this is sync in middleware context

  if (!session?.user) {
    // Not logged in → redirect to login
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;
  const pathname = req.nextUrl.pathname;

  // Role-based protection
  if (pathname.startsWith("/dashboard/admin") && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
  }

  if (
    pathname.startsWith("/dashboard/teacher") &&
    role !== "TEACHER" &&
    role !== "SUPER_ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
  }

  // Optional: allow super admin to access student/teacher dashboards too
  // Or redirect them to /dashboard/admin if you prefer

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // protect all /dashboard subpaths
};
