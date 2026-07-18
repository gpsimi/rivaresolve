import { prisma } from "../src/lib/db";

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Roles
  console.log("Creating roles...");
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMINISTRATOR" },
    update: {},
    create: { name: "ADMINISTRATOR" },
  });

  const officerRole = await prisma.role.upsert({
    where: { name: "MAINTENANCE_OFFICER" },
    update: {},
    create: { name: "MAINTENANCE_OFFICER" },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: "STUDENT_STAFF" },
    update: {},
    create: { name: "STUDENT_STAFF" },
  });

  console.log(`Roles created: ADMINISTRATOR, MAINTENANCE_OFFICER, STUDENT_STAFF`);

  // 2. Seed Categories
  console.log("Creating service request categories...");
  const categories = [
    "Faulty Electricity",
    "Damaged Furniture",
    "Leaking Pipes",
    "Internet Problems",
    "Classroom Equipment",
    "Hostel Maintenance",
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Categories created: ${categories.join(", ")}`);

  // 3. Seed Users
  // Correct bcrypt hash of "Password123"
  const dummyPasswordHash = "$2b$10$FUtFSps1YMaO07jTRE8lqOZHa3FR7J5CPRANjADoo6PeYJ2aFEudy";

  console.log("Creating default users...");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@riva.edu.ng" },
    update: { passwordHash: dummyPasswordHash, institutionalId: "RIVA-ADM-001" },
    create: {
      email: "admin@riva.edu.ng",
      name: "System Administrator",
      institutionalId: "RIVA-ADM-001",
      passwordHash: dummyPasswordHash,
      roleId: adminRole.id,
    },
  });

  const officerUser = await prisma.user.upsert({
    where: { email: "officer@riva.edu.ng" },
    update: { passwordHash: dummyPasswordHash, institutionalId: "RIVA-OFF-001" },
    create: {
      email: "officer@riva.edu.ng",
      name: "Tunde Officer",
      institutionalId: "RIVA-OFF-001",
      passwordHash: dummyPasswordHash,
      roleId: officerRole.id,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@riva.edu.ng" },
    update: { passwordHash: dummyPasswordHash, institutionalId: "RIVA-STU-001" },
    create: {
      email: "student@riva.edu.ng",
      name: "Amara Student",
      institutionalId: "RIVA-STU-001",
      passwordHash: dummyPasswordHash,
      roleId: studentRole.id,
    },
  });

  console.log(`Default users created:
  - Admin: admin@riva.edu.ng (Password123) [ID: RIVA-ADM-001]
  - Officer: officer@riva.edu.ng (Password123) [ID: RIVA-OFF-001]
  - Student: student@riva.edu.ng (Password123) [ID: RIVA-STU-001]`);

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
