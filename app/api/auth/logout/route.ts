// app/api/auth/logout/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/jwt";
import { clearAuthCookies, REFRESH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    // 1. If a token exists, invalidate it in the Database
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        if (payload && payload.id) {
          await prisma.user.update({
            where: { id: payload.id },
            data: { refreshToken: null },
          });
        }
      } catch (jwtError) {
        // Even if JWT is expired/invalid, we should still clear cookies
        console.error("JWT verification failed during logout:", jwtError);
      }
    }

    // 2. Prepare the response
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );

    // 3. Use your helper to clear accessToken and refreshToken cookies
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error("Logout Route Error:", error);

    const response = NextResponse.json(
      { error: "Logout failed" },
      { status: 500 },
    );

    // Always clear cookies even if the database update fails
    clearAuthCookies(response);
    return response;
  }
}
