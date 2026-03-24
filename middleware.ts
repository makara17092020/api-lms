// middleware.ts  (at project root, next to package.json)
import { auth } from "@/lib/auth"; // ← correct import (lowercase auth.ts)
import { NextRequest, NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth; // ← get session from req.auth

  if (!session?.user) {
    // Not logged in → redirect to login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (session.user as any).role;
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

  // Allow the request to continue (no return statement needed)
});

export const config = {
  matcher: ["/dashboard/:path*"], // protect all /dashboard subpaths
};
