import { auth } from "@/lib/auth"; // ← FIXED import
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth(); // ← use auth() here

  if (!session || session.user?.role !== Role.SUPER_ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, email, password, role } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as Role, // SUPER_ADMIN or TEACHER allowed
    },
  });

  return NextResponse.json({ message: "User created", user }, { status: 201 });
}
