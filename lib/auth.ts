// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const {
  handlers, // Creates { GET, POST } for /api/auth/[...nextauth]/route.ts
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );

          if (!isValid) return null;

          // NextAuth expects these properties returned to map to your JWT & Session
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? null,
            role: user.role, // Attach custom properties here
          };
        } catch (err) {
          console.error("Auth error in authorize:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user for Google OAuth
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                password: "", // OAuth users don't need passwords
                role: "STUDENT", // Default role
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    redirect({ url, baseUrl }) {
      // For social auth, return to dashboard by default
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // Type assertion since standard User lacks 'role'
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role; // Type assertion for custom user sessions
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    newUser: "/profile", // Optional: redirect new OAuth users to profile page as fallback
  },

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});
