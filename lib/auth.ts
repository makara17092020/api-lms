// lib/auth.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifyAccessToken, type JwtPayload } from "./jwt";

export interface Session {
  user: JwtPayload | null;
}

// Cookie names
export const ACCESS_COOKIE_NAME = "accessToken";
export const REFRESH_COOKIE_NAME = "refreshToken";

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge,
  path: "/",
});

/**
 * HELPER: Set Cookies on a Response object
 */
export const setAuthCookies = (
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookies.set(ACCESS_COOKIE_NAME, accessToken, cookieOptions(15 * 60));
  res.cookies.set(
    REFRESH_COOKIE_NAME,
    refreshToken,
    cookieOptions(7 * 24 * 60 * 60),
  );
};

/**
 * HELPER: Clear Cookies on a Response object
 */
export const clearAuthCookies = (res: NextResponse) => {
  res.cookies.set(ACCESS_COOKIE_NAME, "", { ...cookieOptions(0), maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE_NAME, "", { ...cookieOptions(0), maxAge: 0 });
};

/**
 * FOR SERVER COMPONENTS (Pages/Layouts)
 * Use this inside 'async' Server Components.
 */
export async function getServerSession(): Promise<Session> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!token) return { user: null };

  const payload = verifyAccessToken(token);
  return { user: payload };
}

/**
 * FOR MIDDLEWARE & API ROUTES
 * Use this when you have access to a Request object.
 */
export function auth(req: NextRequest): Session {
  // Safety check to prevent "reading properties of undefined"
  if (!req) return { user: null };

  // 1. Try httpOnly cookie first
  let token = req.cookies?.get(ACCESS_COOKIE_NAME)?.value;

  // 2. Fallback to Authorization: Bearer
  if (!token) {
    const authHeader = req.headers.get("authorization");
    token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;
  }

  if (!token) return { user: null };

  const payload = verifyAccessToken(token);
  return { user: payload };
}
