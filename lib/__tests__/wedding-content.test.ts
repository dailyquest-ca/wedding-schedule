import { describe, it, expect, beforeEach } from "vitest";
import {
  getContent,
  type Locale,
  type WeddingContent,
  type ScheduleDay,
  type TimeSlot,
} from "@/lib/wedding-content";

describe("getContent", () => {
  const locales: Locale[] = ["en", "ja"];

  locales.forEach((locale) => {
    describe(`locale: ${locale}`, () => {
      let content: WeddingContent;

      beforeEach(() => {
        content = getContent(locale);
      });

      it("returns a title and subtitle", () => {
        expect(content.title).toBeTruthy();
        expect(content.subtitle).toBeTruthy();
      });

      it("returns a schedule with 7 days", () => {
        expect(content.schedule).toHaveLength(7);
      });

      it("each day has a date label and at least one time slot", () => {
        content.schedule.forEach((day: ScheduleDay) => {
          expect(day.dateLabel).toBeTruthy();
          expect(day.dayLabel).toBeTruthy();
          expect(day.slots.length).toBeGreaterThanOrEqual(1);
        });
      });

      it("each time slot has a time, label, and category", () => {
        content.schedule.forEach((day: ScheduleDay) => {
          day.slots.forEach((slot: TimeSlot) => {
            expect(slot.time).toBeTruthy();
            expect(slot.label).toBeTruthy();
            expect(["excursion", "dinner", "busy", "wedding", "free", "travel"]).toContain(
              slot.category
            );
          });
        });
      });

      it("returns notes array with at least one note", () => {
        expect(content.notes.length).toBeGreaterThanOrEqual(1);
        content.notes.forEach((note) => {
          expect(note).toBeTruthy();
        });
      });

      it("returns a whatsapp link and label", () => {
        expect(content.whatsapp.url).toMatch(/^https:\/\//);
        expect(content.whatsapp.label).toBeTruthy();
      });

      it("returns costs array", () => {
        expect(Array.isArray(content.costs)).toBe(true);
      });
    });
  });

  it("returns different text for en vs ja", () => {
    const en = getContent("en");
    const ja = getContent("ja");
    expect(en.title).not.toBe(ja.title);
    expect(en.schedule[0].dayLabel).not.toBe(ja.schedule[0].dayLabel);
  });
});
