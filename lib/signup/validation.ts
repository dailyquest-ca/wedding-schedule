import { GUESTS } from "@/lib/guests";

export function isValidGuestId(guestId: string): boolean {
  return GUESTS.some((g) => g.id === guestId);
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSignupInput(eventId: string, guestId: string): ValidationResult {
  if (!eventId || typeof eventId !== "string") {
    return { valid: false, error: "eventId is required" };
  }
  if (!guestId || typeof guestId !== "string") {
    return { valid: false, error: "guestId is required" };
  }
  if (!isValidGuestId(guestId)) {
    return { valid: false, error: `Unknown guest: ${guestId}` };
  }
  return { valid: true };
}
