import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

// 1. Configure i18n middleware
const locales = ["en", "km"];
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ----------------------------------------------------------------
  // 1. BYPASS STATIC FILES & INTERNAL PATHS
  // ----------------------------------------------------------------
  if (
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ----------------------------------------------------------------
  // 2. AUTH & ROLE EXTRACTION
  // ----------------------------------------------------------------
  // Supports standard NextAuth tokens or your custom accessToken
  const accessToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("accessToken")?.value;

  const userRole = req.cookies.get("userRole")?.value || "STUDENT";
  const isLoggedIn = !!accessToken;

  // ----------------------------------------------------------------
  // 3. API ROUTE PROTECTION (No I18n needed here)
  // ----------------------------------------------------------------
  if (pathname.startsWith("/api/")) {
    // Allow auth-related APIs
    if (pathname.startsWith("/api/auth/")) {
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role-based API protection
    if (pathname.startsWith("/api/admin/") && userRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  }

  // ----------------------------------------------------------------
  // 4. HANDLE INTERNATIONALIZATION (Page Routes)
  // ----------------------------------------------------------------
  // Run intlMiddleware to handle redirects like /admin -> /en/admin
  const response = intlMiddleware(req);

  // ----------------------------------------------------------------
  // 5. PAGE PROTECTION LOGIC (RBAC)
  // ----------------------------------------------------------------
  // Extract locale and path (e.g., "/en/admin/settings" -> path: "/admin/settings")
  const segments = pathname.split("/");
  const currentLocale = locales.includes(segments[1]) ? segments[1] : "en";
  const pathWithoutLocale =
    segments.length > 2 ? `/${segments.slice(2).join("/")}` : "/";

  const isProtectedRoute = [
    "/dashboard",
    "/profile",
    "/admin",
    "/student",
    "/teacher",
  ].some((prefix) => pathWithoutLocale.startsWith(prefix));

  if (isProtectedRoute) {
    // A. Not logged in -> Redirect to login
    if (!isLoggedIn) {
      const loginUrl = new URL(`/${currentLocale}/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // B. Role-based Page Access
    const isAccessingAdmin = pathWithoutLocale.startsWith("/admin");
    const isAccessingTeacher = pathWithoutLocale.startsWith("/teacher");

    if (isAccessingAdmin && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/dashboard`, req.url),
      );
    }

    if (
      isAccessingTeacher &&
      userRole !== "TEACHER" &&
      userRole !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/dashboard`, req.url),
      );
    }
  }

  // ----------------------------------------------------------------
  // 6. REDIRECT LOGGED-IN USERS FROM AUTH PAGES
  // ----------------------------------------------------------------
  const isAuthPage =
    pathWithoutLocale === "/login" || pathWithoutLocale === "/register";
  if (isAuthPage && isLoggedIn) {
    let targetPath = "/student"; // Default
    if (userRole === "SUPER_ADMIN") targetPath = "/admin";
    if (userRole === "TEACHER") targetPath = "/teacher";

    return NextResponse.redirect(
      new URL(`/${currentLocale}${targetPath}`, req.url),
    );
  }

  return response;
}

export const config = {
  matcher: [
    // 1. Match all paths except static files/internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
    // 2. Explicitly ensure API and Root are matched
    "/",
    "/api/:path*",
  ],
};
