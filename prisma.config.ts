// prisma.config.ts
import "dotenv/config"; // ← THIS WAS MISSING
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node --compiler-options {"module":"CommonJS"} ./prisma/seed.ts',
  },

  // Use DIRECT_URL for Neon (recommended for db push / migrate)
  // It avoids connection pooler issues during schema changes
  datasource: {
    url: env("DIRECT_URL"), // ← Changed to DIRECT_URL
  },
});
