import { GUESTS } from "@/lib/guests";
import { getSignuppableSlotIds } from "@/lib/wedding-content";

export function isValidEventId(eventId: string): boolean {
  return getSignuppableSlotIds().includes(eventId);
}

export function isValidGuestId(guestId: string): boolean {
  return GUESTS.some((g) => g.id === guestId);
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSignup(eventId: string, guestId: string): ValidationResult {
  if (!eventId || typeof eventId !== "string") {
    return { valid: false, error: "eventId is required" };
  }
  if (!guestId || typeof guestId !== "string") {
    return { valid: false, error: "guestId is required" };
  }
  if (!isValidEventId(eventId)) {
    return { valid: false, error: `Unknown event: ${eventId}` };
  }
  if (!isValidGuestId(guestId)) {
    return { valid: false, error: `Unknown guest: ${guestId}` };
  }
  return { valid: true };
}
