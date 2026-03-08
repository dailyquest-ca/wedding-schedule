import type { ScheduleDay, TimeSlot, Locale } from "./wedding-content";
import type { DbEventFull } from "./signup/types";
import { dayIndexForDate, SCHEDULE_DATES } from "./schedule-dates";

export function mergeSchedule(
  baseSchedule: ScheduleDay[],
  dbEvents: DbEventFull[],
  locale: Locale
): ScheduleDay[] {
  const result = baseSchedule.map((day) => ({
    ...day,
    slots: day.slots.map((slot) => ({ ...slot })),
  }));

  const overrideMap = new Map<string, DbEventFull>();
  const customByDay = new Map<number, DbEventFull[]>();

  for (const ev of dbEvents) {
    if (!ev.active) continue;

    if (ev.source === "base") {
      overrideMap.set(ev.id, ev);
    } else {
      const dayIdx = dayIndexForDate(ev.dayDate);
      if (dayIdx === -1) continue;
      const list = customByDay.get(dayIdx) ?? [];
      list.push(ev);
      customByDay.set(dayIdx, list);
    }
  }

  for (const day of result) {
    for (let i = 0; i < day.slots.length; i++) {
      const slot = day.slots[i];
      if (!slot.id) continue;
      const override = overrideMap.get(slot.id);
      if (!override) continue;

      day.slots[i] = {
        ...slot,
        time: override.timeLabel,
        label: locale === "ja" ? override.labelJa : override.labelEn,
        description:
          (locale === "ja" ? override.descriptionJa : override.descriptionEn) ?? undefined,
        category: override.category as TimeSlot["category"],
        signupEnabled: override.signupEnabled,
      };
    }
  }

  for (const [dayIdx, events] of customByDay.entries()) {
    if (dayIdx >= result.length) continue;
    const day = result[dayIdx];

    for (const ev of events) {
      const customSlot: TimeSlot = {
        id: ev.id,
        time: ev.timeLabel,
        label: locale === "ja" ? ev.labelJa : ev.labelEn,
        description:
          (locale === "ja" ? ev.descriptionJa : ev.descriptionEn) ?? undefined,
        category: ev.category as TimeSlot["category"],
        signupEnabled: ev.signupEnabled,
      };
      day.slots.push(customSlot);
    }
  }

  return result;
}

export function mergeNotes(
  baseNotes: string[],
  dbNotes: string[] | undefined
): string[] {
  if (dbNotes && dbNotes.length > 0) return dbNotes;
  return baseNotes;
}
