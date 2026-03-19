import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // You can add custom logic here later,
    // e.g., if (req.nextauth.token?.role === "STUDENT" && req.nextUrl.pathname.startsWith("/admin"))
  },
  {
    callbacks: {
      // Basic check: if there's a token, they are authorized
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login", // Redirect here if unauthorized
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
