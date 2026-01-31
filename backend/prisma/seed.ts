import { PrismaClient, Role } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";


async function main() {
  console.log("🌱 Seeding admin user...");

  const password = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@skillbridge.com" },
    update: {},
    create: {
      email: "admin@skillbridge.com",
      password,
      name: "Admin User",
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin created:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// bunx prisma db seed
