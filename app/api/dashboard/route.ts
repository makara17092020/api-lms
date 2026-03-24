import { NextResponse } from "next/server";

export async function GET() {
  // Middleware already guaranteed authentication + valid token
  return NextResponse.json({
    message: "Welcome to your AI-LMS Dashboard!",
    timestamp: new Date().toISOString(),
  });
}
