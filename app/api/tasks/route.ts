import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Tasks API" });
}

export async function POST() {
  return NextResponse.json({ message: "Task created" });
}