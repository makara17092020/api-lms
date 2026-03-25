import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  // Authorization is enforced in proxy.ts, so this API endpoint assumes the user is allowed.
  // In a stricter setup, you can verify the JWT or NextAuth session here.

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
