// app/api/auth/refresh/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  type JwtPayload,
} from "@/lib/jwt";
import { setAuthCookies, REFRESH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies(); // ← FIXED with await
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { refreshToken: true },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { error: "Refresh token revoked" },
        { status: 401 },
      );
    }

    const newRefreshToken = generateRefreshToken(payload);
    const newAccessToken = generateAccessToken(payload);

    await prisma.user.update({
      where: { id: payload.id },
      data: { refreshToken: newRefreshToken },
    });

    const response = NextResponse.json({ accessToken: newAccessToken });
    setAuthCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
