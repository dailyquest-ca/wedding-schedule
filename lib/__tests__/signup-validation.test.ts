import { describe, it, expect } from "vitest";
import { isValidEventId, isValidGuestId, validateSignup } from "@/lib/signup/validation";

describe("isValidEventId", () => {
  it("accepts known event ids", () => {
    expect(isValidEventId("apr6-dinner")).toBe(true);
    expect(isValidEventId("apr8-chichen-itza")).toBe(true);
    expect(isValidEventId("apr12-dinner")).toBe(true);
  });

  it("rejects unknown event ids", () => {
    expect(isValidEventId("apr99-fake")).toBe(false);
    expect(isValidEventId("")).toBe(false);
  });
});

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

describe("validateSignup", () => {
  it("returns valid for a known event+guest pair", () => {
    const result = validateSignup("apr6-dinner", "anna");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns error for unknown event", () => {
    const result = validateSignup("fake-event", "anna");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unknown event");
  });

  it("returns error for unknown guest", () => {
    const result = validateSignup("apr6-dinner", "stranger");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unknown guest");
  });

  it("returns error when eventId is empty", () => {
    const result = validateSignup("", "anna");
    expect(result.valid).toBe(false);
  });

  it("returns error when guestId is empty", () => {
    const result = validateSignup("apr6-dinner", "");
    expect(result.valid).toBe(false);
  });
});
