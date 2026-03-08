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

  describe("Apr 7 – Island or Resort Adventure", () => {
    it("EN includes catamaran excursion to Isla Mujeres", () => {
      const en = getContent("en");
      const apr7 = en.schedule.find((d) => d.dateLabel.includes("Apr 7"));
      const serialized = JSON.stringify(apr7).toLowerCase();
      expect(serialized).toContain("catamaran");
      expect(serialized).toContain("isla mujeres");
    });

    it("EN marks 6:30 PM buffet dinner as tentative", () => {
      const en = getContent("en");
      const apr7 = en.schedule.find((d) => d.dateLabel.includes("Apr 7"));
      const dinnerSlot = apr7!.slots.find(
        (s) => s.category === "dinner" && s.time.includes("6:30")
      );
      expect(dinnerSlot).toBeDefined();
      const text = `${dinnerSlot!.label} ${dinnerSlot!.description ?? ""}`;
      expect(text.toLowerCase()).toContain("tentative");
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

  describe("Apr 9 – Wedding Day detailed timeline", () => {
    it("EN includes Sky Terrace and detailed ceremony/reception timeline", () => {
      const en = getContent("en");
      const apr9 = en.schedule.find((d) => d.dateLabel.includes("Apr 9"));
      const serialized = JSON.stringify(apr9);
      expect(serialized).toContain("Sky Terrace");
      expect(apr9!.slots.find((s) => s.time.includes("5:00"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("5:30"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("7:00"))).toBeDefined();
      expect(apr9!.slots.find((s) => s.time.includes("9:00"))).toBeDefined();
    });

    it("EN includes after-party option", () => {
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

  describe("Apr 5 – Arrival Day", () => {
    it("EN includes a sunset or evening social idea", () => {
      const en = getContent("en");
      const apr5 = en.schedule.find((d) => d.dateLabel.includes("Apr 5"));
      const serialized = JSON.stringify(apr5).toLowerCase();
      expect(serialized).toMatch(/sunset|drinks|lobby/);
    });
  });

  describe("Apr 6 – Arrivals & Welcome Icebreaker", () => {
    it("EN evening includes icebreaker / group hangout language", () => {
      const en = getContent("en");
      const apr6 = en.schedule.find((d) => d.dateLabel.includes("Apr 6"));
      const serialized = JSON.stringify(apr6).toLowerCase();
      expect(serialized).toContain("icebreaker");
    });
  });

  describe("Apr 8 – Rest Up & Family Time", () => {
    it("EN includes a group dinner or evening option", () => {
      const en = getContent("en");
      const apr8 = en.schedule.find((d) => d.dateLabel.includes("Apr 8"));
      const serialized = JSON.stringify(apr8).toLowerCase();
      expect(serialized).toMatch(/dinner|eve/);
    });
  });

  describe("Apr 10 – Lazy Day", () => {
    it("EN includes an optional evening idea", () => {
      const en = getContent("en");
      const apr10 = en.schedule.find((d) => d.dateLabel.includes("Apr 10"));
      const serialized = JSON.stringify(apr10).toLowerCase();
      expect(serialized).toMatch(/tacos|sunset|evening|bonfire/);
    });
  });

  describe("Apr 13 – Goodbyes", () => {
    it("EN includes final breakfast / hugs language", () => {
      const en = getContent("en");
      const apr13 = en.schedule.find((d) => d.dateLabel.includes("Apr 13"));
      const serialized = JSON.stringify(apr13).toLowerCase();
      expect(serialized).toContain("breakfast");
    });
  });

  describe("copy polish – no generic filler in labels", () => {
    it("EN labels avoid overused generic phrasing", () => {
      const en = getContent("en");
      const labels = en.schedule
        .flatMap((d) => d.slots.map((s) => s.label.toLowerCase()));
      expect(labels).not.toContain("early arrivals");
      expect(labels).not.toContain("recovery & lazy day");
    });
  });
});
