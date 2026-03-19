// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type { Role } from "@prisma/client"; // ← import your enum if using Prisma

declare module "next-auth" {
  /**
   * The shape of the user object returned from authorize() in Credentials
   * and from profile() in OAuth providers.
   */
  interface User extends DefaultUser {
    id: string; // always include id
    role: Role; // your custom field
    // Add other custom fields if needed, e.g. emailVerified: Date | null;
  }

  /**
   * Session shape returned by useSession(), getSession(), auth()
   */
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  /**
   * When using a database adapter (Prisma, etc.), extend AdapterUser
   */
  interface AdapterUser extends DefaultUser {
    id: string;
    role: Role;
    // emailVerified?: Date | null; etc.
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
  }
}
