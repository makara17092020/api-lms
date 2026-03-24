// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default function middleware(req: NextRequest) {
  const session = auth(req);
  const pathname = req.nextUrl.pathname;

  // 1. PUBLIC: Allow all authentication API routes (login, register, logout)
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // 2. === API ROUTES PROTECTION (JSON responses) ===
  if (pathname.startsWith("/api/")) {
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;

    // RBAC for API
    if (pathname.startsWith("/api/admin/") && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Super Admin only" },
        { status: 403 },
      );
    }
    if (
      pathname.startsWith("/api/teacher/") &&
      role !== "TEACHER" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden: Teacher only" },
        { status: 403 },
      );
    }
    if (
      pathname.startsWith("/api/student/") &&
      role !== "STUDENT" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden: Student only" },
        { status: 403 },
      );
    }

    return NextResponse.next();
  }

  // 3. === PAGE REDIRECTS (UI protection) ===

  // Protect /profile and /dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!session.user) {
      // FIX: Redirect to /login (not /auth/login)
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = session.user.role;

    // RBAC for Dashboard Pages
    if (pathname.startsWith("/dashboard/admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    if (
      pathname.startsWith("/dashboard/teacher") &&
      role !== "TEACHER" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    return NextResponse.next();
  }

  // 4. Redirect logged-in users away from login/register pages
  if ((pathname === "/login" || pathname === "/register") && session.user) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Added /profile to the matcher so it gets checked
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
