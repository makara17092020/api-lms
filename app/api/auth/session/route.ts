// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Use your custom auth function to verify the cookie/header
    const session = auth(req);

    // Return the user payload (or null if not authenticated)
    return NextResponse.json(session);
  } catch (error) {
    console.error("[SESSION_ROUTE_ERROR]:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
