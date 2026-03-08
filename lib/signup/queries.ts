import { getDb } from "@/lib/db";
import { getSignuppableSlotIds, getContent } from "@/lib/wedding-content";
import { getGuestById } from "@/lib/guests";
import type { EventWithCount, EventRoster } from "./types";

export async function getEventsWithCounts(): Promise<EventWithCount[]> {
  const sql = getDb();
  const slotIds = getSignuppableSlotIds();
  const en = getContent("en");
  const ja = getContent("ja");

  const rows = await sql`
    SELECT event_id, COUNT(*)::int AS count
    FROM event_signups
    WHERE event_id = ANY(${slotIds})
    GROUP BY event_id
  `;

  const countMap = new Map(rows.map((r) => [r.event_id as string, r.count as number]));

  const allSlots = en.schedule.flatMap((day) => day.slots);
  const allSlotsJa = ja.schedule.flatMap((day) => day.slots);

  return slotIds.map((id) => {
    const enSlot = allSlots.find((s) => s.id === id)!;
    const jaSlot = allSlotsJa.find((s) => s.id === id)!;
    return {
      eventId: id,
      titleEn: enSlot.label,
      titleJa: jaSlot.label,
      category: enSlot.category,
      count: countMap.get(id) ?? 0,
    };
  });
}

export async function addSignup(eventId: string, guestId: string): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO event_signups (event_id, guest_id)
    VALUES (${eventId}, ${guestId})
    ON CONFLICT (event_id, guest_id) DO NOTHING
  `;
}

export async function removeSignup(eventId: string, guestId: string): Promise<void> {
  const sql = getDb();
  await sql`
    DELETE FROM event_signups
    WHERE event_id = ${eventId} AND guest_id = ${guestId}
  `;
}

export async function getGuestsForEvent(eventId: string): Promise<string[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT guest_id FROM event_signups
    WHERE event_id = ${eventId}
    ORDER BY created_at
  `;
  return rows.map((r) => r.guest_id as string);
}

export async function getEventRosters(): Promise<EventRoster[]> {
  const sql = getDb();
  const slotIds = getSignuppableSlotIds();
  const en = getContent("en");
  const allSlots = en.schedule.flatMap((day) => day.slots);

  const rows = await sql`
    SELECT event_id, guest_id
    FROM event_signups
    WHERE event_id = ANY(${slotIds})
    ORDER BY event_id, created_at
  `;

  return slotIds.map((id) => {
    const slot = allSlots.find((s) => s.id === id)!;
    const eventGuests = rows
      .filter((r) => r.event_id === id)
      .map((r) => {
        const guest = getGuestById(r.guest_id as string);
        return {
          guestId: r.guest_id as string,
          firstName: guest?.firstName ?? (r.guest_id as string),
        };
      });
    return {
      eventId: id,
      titleEn: slot.label,
      count: eventGuests.length,
      guests: eventGuests,
    };
  });
}
