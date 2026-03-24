import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Study plan API" });
}

export async function POST() {
  return NextResponse.json({ message: "Study plan created" });
}