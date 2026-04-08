import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  generateAccessToken,
  generateRefreshToken,
  type JwtPayload,
} from "@/lib/jwt";
import { setAuthCookies } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up or use Google login." },
        { status: 404 },
      );
    }
 
    if (!user.password) {
      return NextResponse.json(
        { error: "This account is linked with Google. Please sign in with Google." },
        { status: 401 },
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || undefined,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    // 1. Set your custom HTTP-Only JWT cookies
    setAuthCookies(response, accessToken, refreshToken);

    // 2. FIX: Drop the userRole cookie so proxy.ts knows you are SUPER_ADMIN!
    response.cookies.set("userRole", user.role, {
      httpOnly: false, // Must be false so Next.js middleware (Edge) can parse it quickly
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // matches your 7-day token refresh lifecycle
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
