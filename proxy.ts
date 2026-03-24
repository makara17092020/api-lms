// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const userRoleCookie = req.cookies.get("userRole")?.value;

  const isLoggedIn = !!accessToken;
  const role = userRoleCookie || "STUDENT";

  if (pathname.startsWith("/api/")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (pathname.startsWith("/api/admin/") && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin only" },
        { status: 403 },
      );
    }

    return NextResponse.next();
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/student") || // Added student path
    pathname.startsWith("/teacher") // Added teacher path
  ) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url)); // unauthorized redirect
    }

    if (
      pathname.startsWith("/teacher") &&
      role !== "TEACHER" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  // kick logged in users away from /login or /register to their designated zones
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    if (role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (role === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher", req.url));
    } else {
      return NextResponse.redirect(new URL("/student", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
