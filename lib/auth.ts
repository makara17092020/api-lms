// lib/auth.ts  (keep in lib/ for now)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const {
  handlers, // this creates { GET, POST }
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called"); // temp debug
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );

          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? null,
            role: user.role,
          };
        } catch (err) {
          console.error("Auth error in authorize:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  session: { strategy: "jwt" },

  secret: process.env.AUTH_SECRET,
});
