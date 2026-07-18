import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const { email, password, name, role, institutionalId } = await request.json();

    // 1. Basic validation
    if (!email || !password || !name || !role || !institutionalId) {
      return NextResponse.json(
        { error: "Name, institutional ID, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // 2. Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Check if institutional ID already exists
    const existingId = await prisma.user.findUnique({
      where: { institutionalId: institutionalId.trim() },
    });

    if (existingId) {
      return NextResponse.json(
        { error: "This Matric Number / Employee ID is already registered" },
        { status: 400 }
      );
    }

    // 4. Find the requested role in the database
    const requestedRole = role === "MAINTENANCE_OFFICER" ? "MAINTENANCE_OFFICER" : "STUDENT_STAFF";
    let dbRole = await prisma.role.findUnique({
      where: { name: requestedRole },
    });

    // If the roles haven't been seeded yet, fallback creation
    if (!dbRole) {
      dbRole = await prisma.role.create({
        data: { name: requestedRole },
      });
    }

    // 5. Hash the password
    const hashedPassword = await hashPassword(password);

    // 6. Create the user
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        institutionalId: institutionalId.trim(),
        passwordHash: hashedPassword,
        roleId: dbRole.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Registration successful", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
