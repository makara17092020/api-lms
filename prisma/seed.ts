// prisma/seed.ts
import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@ailms.com";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "admin@ailms.com";

  console.log(`🚀 Starting seed process for: ${adminEmail}`);

  // Use bcrypt to match your Auth.js / login logic
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      // If user exists, force these values to be correct
      password: hashedPassword,
      role: "SUPER_ADMIN",
      name: "Super Admin",
    },
    create: {
      // If user doesn't exist, create them
      email: adminEmail,
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Admin user processed successfully:");
  console.log(`   - Email: ${admin.email}`);
  console.log(`   - Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
