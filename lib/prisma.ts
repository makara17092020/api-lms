import { PrismaClient } from "@prisma/client";

// === CHANGE THIS LINE TO MATCH YOUR ADAPTER ===
import { PrismaPg } from "@prisma/adapter-pg"; // PostgreSQL
// import { PrismaMySql } from '@prisma/adapter-mysql'   // MySQL
// import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'   // SQLite

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// === CREATE THE ADAPTER ===
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
// const adapter = new PrismaMySql({ connectionString: process.env.DATABASE_URL! })
// const adapter = new PrismaBetterSqlite3({ connectionString: process.env.DATABASE_URL! })

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // ← this is the Prisma 7 way
  });
