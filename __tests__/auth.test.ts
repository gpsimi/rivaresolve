import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "@/lib/password";

describe("Password Utility Functions", () => {
  it("should successfully hash a plaintext password", async () => {
    const password = "mySecurePassword123";
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it("should return true when comparing the correct plaintext password with the hash", async () => {
    const password = "correctPassword";
    const hash = await hashPassword(password);
    
    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should return false when comparing an incorrect password with the hash", async () => {
    const password = "correctPassword";
    const wrongPassword = "wrongPassword";
    const hash = await hashPassword(password);
    
    const isValid = await comparePassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });
});
