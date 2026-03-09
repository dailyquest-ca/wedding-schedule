import type { ScheduleDay, TimeSlot, Locale } from "./wedding-content";
import type { DbEventFull } from "./signup/types";
import { dayIndexForDate } from "./schedule-dates";

function localeLabel(
  locale: Locale,
  event: DbEventFull
): { label: string; description: string | undefined } {
  const label =
    locale === "ja"
      ? event.labelJa.trim() || event.labelEn
      : event.labelEn.trim() || event.labelJa;
  const descriptionSource =
    locale === "ja"
      ? event.descriptionJa?.trim() || event.descriptionEn?.trim()
      : event.descriptionEn?.trim() || event.descriptionJa?.trim();

  return {
    label,
    description: descriptionSource || undefined,
  };
}

function slotSortValue(time: string): number {
  const normalized = time.trim().toLowerCase();

  if (normalized.includes("all day") || normalized.includes("終日")) return 0;
  if (normalized.includes("morning") || normalized === "朝") return 9 * 60;
  if (normalized.includes("midday") || normalized.includes("noon")) return 12 * 60;
  if (normalized.includes("afternoon") || normalized === "午後") return 15 * 60;
  if (normalized.includes("daytime") || normalized === "日中") return 15 * 60;
  if (normalized.includes("evening") || normalized === "夜") return 18 * 60;

  const twelveHour = normalized.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
  if (twelveHour) {
    let hour = Number(twelveHour[1]) % 12;
    if (twelveHour[3] === "pm") hour += 12;
    const minute = Number(twelveHour[2] ?? "0");
    return hour * 60 + minute;
  }

  const twentyFourHour = normalized.match(/(\d{1,2}):(\d{2})/);
  if (twentyFourHour) {
    const hour = Number(twentyFourHour[1]);
    const minute = Number(twentyFourHour[2]);
    return hour * 60 + minute;
  }

  return 24 * 60;
}

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
      const localized = localeLabel(locale, override);

      day.slots[i] = {
        ...slot,
        time: override.timeLabel,
        label: localized.label,
        description: localized.description,
        category: override.category as TimeSlot["category"],
        signupEnabled: override.signupEnabled,
      };
    }
  }

  for (const [dayIdx, events] of customByDay.entries()) {
    if (dayIdx >= result.length) continue;
    const day = result[dayIdx];

    for (const ev of events) {
      const localized = localeLabel(locale, ev);
      const customSlot: TimeSlot = {
        id: ev.id,
        time: ev.timeLabel,
        label: localized.label,
        description: localized.description,
        category: ev.category as TimeSlot["category"],
        signupEnabled: ev.signupEnabled,
      };
      day.slots.push(customSlot);
    }

    day.slots.sort((a, b) => slotSortValue(a.time) - slotSortValue(b.time));
  }

  for (const day of result) {
    day.slots.sort((a, b) => slotSortValue(a.time) - slotSortValue(b.time));
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
