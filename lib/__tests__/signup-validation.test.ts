import { describe, it, expect } from "vitest";
import { isValidGuestId, validateSignupInput } from "@/lib/signup/validation";

describe("isValidGuestId", () => {
  it("accepts known guest ids", () => {
    expect(isValidGuestId("anna")).toBe(true);
    expect(isValidGuestId("lance")).toBe(true);
  });

  it("rejects unknown guest ids", () => {
    expect(isValidGuestId("stranger")).toBe(false);
    expect(isValidGuestId("")).toBe(false);
  });
});

describe("validateSignupInput", () => {
  it("returns valid for a known guest with any eventId string", () => {
    const result = validateSignupInput("apr6-dinner", "anna");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns error for unknown guest", () => {
    const result = validateSignupInput("apr6-dinner", "stranger");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unknown guest");
  });

  it("returns error when eventId is empty", () => {
    const result = validateSignupInput("", "anna");
    expect(result.valid).toBe(false);
  });

  it("returns error when guestId is empty", () => {
    const result = validateSignupInput("apr6-dinner", "");
    expect(result.valid).toBe(false);
  });
});
