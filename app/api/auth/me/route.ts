import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth"; // Imports your custom JWT session tracker
import { prisma } from "@/lib/prisma"; // Your Neon Postgres DB connection

export async function GET() {
  try {
    // 1. Grab cookies using your custom JWT validation
    const session = await getServerSession();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Query Neon Postgres for the real student data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true, // Holds the student avatar URL or Base64 string
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("[AUTH_ME_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    // 1. Verify custom session
    const session = await getServerSession();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let imageUrl = null;

    // 2. Parse uploaded image and convert it to Base64 String
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageUrl = `data:${imageFile.type};base64,${buffer.toString("base64")}`;
    }

    // 3. Persist the real edits to Neon Database using Prisma
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name,
        ...(imageUrl && { image: imageUrl }), // If no image uploaded, don't overwrite current image
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[AUTH_ME_PUT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
