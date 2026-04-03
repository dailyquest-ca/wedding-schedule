import { getDb } from "@/lib/db";
import { getGuestById, getDisplayName } from "@/lib/guests";
import { getDbEvents } from "./content-queries";
import type { EventRoster } from "./types";

export interface RosterGuest {
  guestId: string;
  firstName: string;
  displayNameEn: string;
  displayNameJa: string;
}

export async function getRosterForEvent(eventId: string): Promise<RosterGuest[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT guest_id FROM event_signups
    WHERE event_id = ${eventId}
    ORDER BY created_at
  `;
  return rows.map((r) => {
    const guest = getGuestById(r.guest_id as string);
    return {
      guestId: r.guest_id as string,
      firstName: guest?.firstName ?? (r.guest_id as string),
      displayNameEn: guest ? getDisplayName(guest, "en") : (r.guest_id as string),
      displayNameJa: guest ? getDisplayName(guest, "ja") : (r.guest_id as string),
    };
  });
}

export async function addSignup(eventId: string, guestId: string): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO event_signups (event_id, guest_id)
    SELECT ${eventId}, ${guestId}
    WHERE NOT EXISTS (
      SELECT 1
      FROM event_signups
      WHERE event_id = ${eventId} AND guest_id = ${guestId}
    )
  `;
}

export async function removeSignup(eventId: string, guestId: string): Promise<void> {
  const sql = getDb();
  await sql`
    DELETE FROM event_signups
    WHERE event_id = ${eventId} AND guest_id = ${guestId}
  `;
}

export async function getEventRosters(): Promise<EventRoster[]> {
  const sql = getDb();
  const dbEvents = await getDbEvents();
  const activeSignupEvents = dbEvents.filter((e) => e.active && e.signupEnabled);
  const eventIds = activeSignupEvents.map((e) => e.id);

  const rows = eventIds.length > 0
    ? await sql`
        SELECT event_id, guest_id
        FROM event_signups
        WHERE event_id = ANY(${eventIds})
        ORDER BY event_id, created_at
      `
    : [];

  return activeSignupEvents.map((ev) => {
    const eventGuests = rows
      .filter((r) => r.event_id === ev.id)
      .map((r) => {
        const guest = getGuestById(r.guest_id as string);
        return {
          guestId: r.guest_id as string,
          firstName: guest?.firstName ?? (r.guest_id as string),
        };
      });
    return {
      eventId: ev.id,
      titleEn: ev.labelEn,
      count: eventGuests.length,
      guests: eventGuests,
    };
  });
}
