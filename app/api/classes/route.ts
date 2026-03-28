import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Next.js 15+ compatible jwt verification
import { cookies } from "next/headers";
import { ClassService } from "@/app/services/class.servide"; // Keeping your typo!

async function getAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: string; role: string; email: string };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (auth.role !== "TEACHER" && auth.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Teachers or Admins only" },
      { status: 403 },
    );
  }

  try {
    const { className, teacherId } = await req.json();
    if (!className) {
      return NextResponse.json(
        { error: "Class Name is required" },
        { status: 400 },
      );
    }

    const targetTeacherId =
      auth.role === "SUPER_ADMIN" ? teacherId || auth.id : auth.id;

    const newClass = await ClassService.createClass(className, targetTeacherId);
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const auth = await getAuth();
  if (!auth)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  try {
    // ✅ NEW GROUPED LOGIC: Pulls classes if you are looking for 'teacher' data!
    if (type === "teacher") {
      if (auth.role === "SUPER_ADMIN") {
        const classes = await ClassService.getAllClasses();
        return NextResponse.json(classes);
      }

      if (auth.role === "TEACHER") {
        const classes = await ClassService.getClassesByTeacher(auth.id);
        return NextResponse.json(classes);
      }
    }

    if (type === "student" && auth.role === "STUDENT") {
      const classes = await ClassService.getClassesByStudent(auth.id);
      return NextResponse.json(classes);
    }

    return NextResponse.json(
      { error: "Invalid query parameter or user role mismatch" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
