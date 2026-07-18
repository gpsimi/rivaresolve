// @vitest-environment node
import { describe, it, expect } from "vitest";
import { signJWT, verifyJWT, UserSession } from "@/lib/auth";

describe("JWT Role-Based Access Control Token Tests", () => {
  const mockAdminSession: UserSession = {
    userId: "user-admin-123",
    email: "admin@riva.edu.ng",
    role: "ADMINISTRATOR",
    name: "System Admin",
  };

  const mockStudentSession: UserSession = {
    userId: "user-student-456",
    email: "student@riva.edu.ng",
    role: "STUDENT_STAFF",
    name: "Amara Student",
  };

  it("should sign and verify an admin session payload correctly", async () => {
    const token = await signJWT(mockAdminSession);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifyJWT(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(mockAdminSession.userId);
    expect(decoded?.role).toBe("ADMINISTRATOR");
  });

  it("should sign and verify a student session payload correctly", async () => {
    const token = await signJWT(mockStudentSession);
    expect(token).toBeDefined();

    const decoded = await verifyJWT(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.role).toBe("STUDENT_STAFF");
    expect(decoded?.email).toBe(mockStudentSession.email);
  });

  it("should fail validation and return null for tampered or invalid JWTs", async () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidtokenbody.signature";
    const decoded = await verifyJWT(invalidToken);
    expect(decoded).toBeNull();
  });
});
