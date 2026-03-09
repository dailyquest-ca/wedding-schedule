import { describe, it, expect, beforeEach } from "vitest";
import {
  getContent,
  getSignuppableSlotIds,
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

      it("returns a schedule covering Apr 5 through Apr 13 (9 days)", () => {
        expect(content.schedule).toHaveLength(9);
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

      it("returns a photos link and label", () => {
        expect(content.photos.url).toMatch(/^https:\/\//);
        expect(content.photos.label).toBeTruthy();
      });
    });
  });

  it("returns different text for en vs ja", () => {
    const en = getContent("en");
    const ja = getContent("ja");
    expect(en.title).not.toBe(ja.title);
    expect(en.schedule[0].dayLabel).not.toBe(ja.schedule[0].dayLabel);
  });

  it("schedule starts Apr 5 and ends Apr 13 in English", () => {
    const en = getContent("en");

    expect(en.schedule[0].dateLabel).toContain("Apr 5");
    expect(en.schedule[8].dateLabel).toContain("Apr 13");
    expect(en.schedule).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dateLabel: expect.stringContaining("Apr 9"),
        }),
      ])
    );
  });

  it("includes first-name-only arrival summaries in English", () => {
    const en = getContent("en");
    const serialized = JSON.stringify(en.schedule);

    expect(serialized).toContain("Anna");
    expect(serialized).toContain("Zak");
    expect(serialized).toContain("Ishan");
    expect(serialized).toContain("Ami");
    expect(serialized).not.toContain("Kawamura");
    expect(serialized).not.toContain("Verma");
  });

  it("uses Japanese 様 for guest names except family exceptions", () => {
    const ja = getContent("ja");
    const serialized = JSON.stringify(ja.schedule);

    expect(serialized).toContain("Ishan様");
    expect(serialized).toContain("Haruna様");
    expect(serialized).toContain("Kento様");
    expect(serialized).toContain("Lance様");
    expect(serialized).toContain("Anna");
    expect(serialized).toContain("Zak");
    expect(serialized).toContain("Takaaki");
    expect(serialized).toContain("Yoko");
    expect(serialized).not.toContain("Anna様");
    expect(serialized).not.toContain("Zak様");
    expect(serialized).not.toContain("Takaaki様");
    expect(serialized).not.toContain("Yoko様");
  });

  describe("Apr 7", () => {
    it("EN has 6:30 PM Welcome Dinner at Main Buffet (may be moved/cancelled)", () => {
      const en = getContent("en");
      const apr7 = en.schedule.find((d) => d.dateLabel.includes("Apr 7"));
      const dinnerSlot = apr7!.slots.find(
        (s) => s.category === "dinner" && s.time.includes("6:30")
      );
      expect(dinnerSlot).toBeDefined();
      const text = `${dinnerSlot!.label} ${dinnerSlot!.description ?? ""}`.toLowerCase();
      expect(text).toContain("buffet");
      expect(text).toMatch(/moved|cancelled|tentative/);
    });

    it("JA marks 18:30 buffet dinner as tentative with （仮）", () => {
      const ja = getContent("ja");
      const apr7 = ja.schedule.find((d) => d.dateLabel.includes("4月7日"));
      const dinnerSlot = apr7!.slots.find(
        (s) => s.category === "dinner" && s.time.includes("18:30")
      );
      expect(dinnerSlot).toBeDefined();
      const text = `${dinnerSlot!.label} ${dinnerSlot!.description ?? ""}`;
      expect(text).toContain("（仮）");
    });
  });

  describe("Apr 9 – Wedding Day", () => {
    it("EN includes all-day wedding prep and Sky Terrace timeline", () => {
      const en = getContent("en");
      const apr9 = en.schedule.find((d) => d.dateLabel.includes("Apr 9"));
      const serialized = JSON.stringify(apr9).toLowerCase();
      expect(serialized).toContain("wedding preparation");
      expect(serialized).toContain("sky terrace");
      expect(apr9!.slots.find((s) => s.time.includes("5:00"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("5:30"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("7:00"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("9:00"))).toBeDefined();
    });

    it("EN includes optional after-party", () => {
      const en = getContent("en");
      const apr9 = en.schedule.find((d) => d.dateLabel.includes("Apr 9"));
      const serialized = JSON.stringify(apr9).toLowerCase();
      expect(serialized).toContain("after-party");
    });

    it("JA includes Sky Terrace and key ceremony times", () => {
      const ja = getContent("ja");
      const apr9 = ja.schedule.find((d) => d.dateLabel.includes("4月9日"));
      const serialized = JSON.stringify(apr9);
      expect(serialized).toContain("Sky Terrace");
      expect(apr9!.slots.find((s) => s.time.includes("17:00"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("17:30"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("19:00"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("21:00"))).toBeDefined();
    });
  });

  describe("Apr 12 – Farewell Bash", () => {
    it("EN includes a final dinner together", () => {
      const en = getContent("en");
      const apr12 = en.schedule.find((d) => d.dateLabel.includes("Apr 12"));
      const serialized = JSON.stringify(apr12).toLowerCase();
      expect(serialized).toContain("final dinner");
    });
  });

  describe("Apr 5", () => {
    it("EN has only early arrivals slot", () => {
      const en = getContent("en");
      const apr5 = en.schedule.find((d) => d.dateLabel.includes("Apr 5"));
      expect(apr5!.slots.length).toBeGreaterThanOrEqual(1);
      expect(apr5!.slots.some((s) => s.category === "travel")).toBe(true);
    });
  });

  describe("Apr 6 – Arrivals & Welcome", () => {
    it("EN includes icebreaker in description and 7 PM dinner", () => {
      const en = getContent("en");
      const apr6 = en.schedule.find((d) => d.dateLabel.includes("Apr 6"));
      const serialized = JSON.stringify(apr6).toLowerCase();
      expect(serialized).toContain("icebreaker");
      expect(apr6!.slots.some((s) => s.category === "dinner" && s.time.includes("7"))).toBe(true);
    });
  });

  describe("Apr 8 – Chichen Itza", () => {
    it("EN includes all-day Chichen Itza tour and late dinner", () => {
      const en = getContent("en");
      const apr8 = en.schedule.find((d) => d.dateLabel.includes("Apr 8"));
      const serialized = JSON.stringify(apr8).toLowerCase();
      expect(serialized).toContain("chichen itza");
      expect(serialized).toContain("cenote");
      expect(serialized).toContain("valladolid");
      expect(serialized).toContain("dinner");
    });
  });

  describe("Apr 13 – Goodbyes", () => {
    it("EN includes final breakfast and goodbyes", () => {
      const en = getContent("en");
      const apr13 = en.schedule.find((d) => d.dateLabel.includes("Apr 13"));
      const serialized = JSON.stringify(apr13).toLowerCase();
      expect(serialized).toContain("breakfast");
    });
  });

  describe("signuppable slots", () => {
    it("returns 8 signuppable event IDs", () => {
      const ids = getSignuppableSlotIds();
      expect(ids).toHaveLength(8);
    });

    it("includes dinner and excursion events", () => {
      const ids = getSignuppableSlotIds();
      expect(ids).toContain("apr6-dinner");
      expect(ids).toContain("apr7-dinner");
      expect(ids).toContain("apr8-chichen-itza");
      expect(ids).toContain("apr8-dinner");
      expect(ids).toContain("apr11-golf");
      expect(ids).toContain("apr11-coco-bongo");
      expect(ids).toContain("apr12-outing");
      expect(ids).toContain("apr12-dinner");
    });

    it("EN and JA slots have matching IDs", () => {
      const en = getContent("en");
      const ja = getContent("ja");
      const enIds = en.schedule.flatMap((d) => d.slots).filter((s) => s.id).map((s) => s.id);
      const jaIds = ja.schedule.flatMap((d) => d.slots).filter((s) => s.id).map((s) => s.id);
      expect(enIds).toEqual(jaIds);
    });
  });
});
