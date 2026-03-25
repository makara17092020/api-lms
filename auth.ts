import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import type { Adapter } from "next-auth/adapters"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!dbUser) {
        // New Google user; onboarding to complete profile
        return "/complete-profile"
      }

      if (!dbUser.password) {
        // Existing OAuth user who hasn't set password yet
        return "/complete-profile"
      }

      // Existing user with password: redirect to role dashboard
      if (dbUser.role === "SUPER_ADMIN") return "/admin";
      if (dbUser.role === "TEACHER") return "/teacher";
      return "/student";
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Find user in database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
          token.needsCompletion = !dbUser.password
        } else {
          // New user from OAuth
          token.needsCompletion = true
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as any
        session.user.needsCompletion = token.needsCompletion as boolean | undefined
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard based on role
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
})