export const SCHEDULE_DATES = [
  "2026-04-05",
  "2026-04-06",
  "2026-04-07",
  "2026-04-08",
  "2026-04-09",
  "2026-04-10",
  "2026-04-11",
  "2026-04-12",
  "2026-04-13",
] as const;

export type ScheduleDateString = (typeof SCHEDULE_DATES)[number];

export function dayIndexForDate(date: string): number {
  return SCHEDULE_DATES.indexOf(date as ScheduleDateString);
}
