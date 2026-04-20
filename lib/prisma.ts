import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg"; // Use pg instead of just a string

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a connection pool that handles the SSL error
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This is the secret fix for Render!
  },
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_VERSION !== "production") globalForPrisma.prisma = prisma;
