// prisma/prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Priority: DIRECT_URL (Terminal) -> DATABASE_URL (Docker) -> Fallback
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "postgresql://lms_user:lms_password@localhost:5436/lms_database?sslmode=disable",
  },
});