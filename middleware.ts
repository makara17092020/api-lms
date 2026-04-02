// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "km"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. BYPASS: If it's a file, Next.js internal, or ANY API route, don't touch it.
  // We check for "/api" generally instead of just "/api/auth"
  if (
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. Run next-intl middleware for PAGE routes only
  // This handles the locale redirect (e.g., /admin -> /en/admin)
  const intlResponse = intlMiddleware(req);
  if (intlResponse && pathname === "/") {
    return intlResponse;
  }

  // 3. Edge-safe auth check via cookies
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("accessToken")?.value;

  const isLoggedIn = !!sessionCookie;

  // 4. Extract locale and clean path for protection logic
  const segments = pathname.split("/");
  const locale = ["en", "km"].includes(segments[1]) ? segments[1] : "en";
  const pathWithoutLocale =
    segments.length > 2 ? `/${segments.slice(2).join("/")}` : "/";

  // 5. Protection logic
  const protectedPrefixes = [
    "/dashboard",
    "/profile",
    "/admin",
    "/student",
    "/teacher",
  ];

  const isProtectedRoute = protectedPrefixes.some((p) =>
    pathWithoutLocale.startsWith(p),
  );

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthPage =
    pathWithoutLocale === "/login" || pathWithoutLocale === "/register";
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  // If next-intl generated a redirect/response earlier, return it now
  if (intlResponse) return intlResponse;

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
