import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  let connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/rivalesolve";
  
  try {
    const url = new URL(connectionString);
    if (url.protocol === "prisma+postgres:") {
      const apiKey = url.searchParams.get("api_key");
      if (apiKey) {
        const decoded = Buffer.from(apiKey, "base64").toString("utf-8");
        const parsed = JSON.parse(decoded);
        if (parsed.databaseUrl) {
          connectionString = parsed.databaseUrl;
        }
      }
    }
  } catch (e) {
    console.error("Failed to parse Prisma Postgres URL:", e);
  }

  const pool = new pg.Pool({ connectionString });
  
  // CRITICAL: Prevent Next.js from crashing when Prisma Postgres kills idle connections
  pool.on("error", (err) => {
    console.error("PostgreSQL Pool Error:", err.message);
  });

  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
