import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  
  // This logic checks if you're in Docker or Local
  datasource: {
    url: env("DIRECT_URL") || "postgresql://lms_user:lms_password@localhost:5435/lms_database?sslmode=disable",
  },
});