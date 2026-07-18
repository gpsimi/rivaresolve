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
    update: { passwordHash: dummyPasswordHash },
    create: {
      email: "admin@riva.edu.ng",
      name: "System Administrator",
      passwordHash: dummyPasswordHash,
      roleId: adminRole.id,
    },
  });

  const officerUser = await prisma.user.upsert({
    where: { email: "officer@riva.edu.ng" },
    update: { passwordHash: dummyPasswordHash },
    create: {
      email: "officer@riva.edu.ng",
      name: "Tunde Officer",
      passwordHash: dummyPasswordHash,
      roleId: officerRole.id,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@riva.edu.ng" },
    update: { passwordHash: dummyPasswordHash },
    create: {
      email: "student@riva.edu.ng",
      name: "Amara Student",
      passwordHash: dummyPasswordHash,
      roleId: studentRole.id,
    },
  });

  console.log(`Default users created:
  - Admin: admin@riva.edu.ng (Password123)
  - Officer: officer@riva.edu.ng (Password123)
  - Student: student@riva.edu.ng (Password123)`);

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
