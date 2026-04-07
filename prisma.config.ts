import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This allows you to pass the URL via terminal OR use the default 5436
    url: env("DIRECT_URL") || env("DATABASE_URL") || "postgresql://lms_user:lms_password@localhost:5436/lms_database?sslmode=disable",
  },
});