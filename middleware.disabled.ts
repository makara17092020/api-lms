import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  // If user is authenticated and needs profile completion
  if (req.auth?.user?.needsCompletion && !pathname.startsWith("/complete-profile")) {
    return NextResponse.redirect(new URL("/complete-profile", req.url))
  }

  // If user is authenticated and doesn't need completion, redirect from auth pages
  if (req.auth && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}