import { describe, it, expect } from "vitest";
import { mergeSchedule, mergeNotes } from "@/lib/merge-content";
import { getContent } from "@/lib/wedding-content";
import type { DbEventFull } from "@/lib/signup/types";

function makeDbEvent(overrides: Partial<DbEventFull> & { id: string }): DbEventFull {
  return {
    dayDate: "2026-04-06",
    timeLabel: "7:00 PM",
    category: "dinner",
    signupEnabled: true,
    active: true,
    source: "base",
    labelEn: "Test Event",
    descriptionEn: "Test description",
    labelJa: "テストイベント",
    descriptionJa: "テスト説明",
    ...overrides,
  };
}

describe("mergeSchedule", () => {
  it("returns base schedule with slots reordered by time when no DB events", () => {
    const base = getContent("en").schedule;
    const merged = mergeSchedule(base, [], "en");
    expect(merged.length).toBe(base.length);
    merged.forEach((day, i) => {
      expect(day.dateLabel).toBe(base[i].dateLabel);
      expect(day.slots.length).toBe(base[i].slots.length);
      const baseLabels = base[i].slots.map((s) => s.label).sort();
      const mergedLabels = day.slots.map((s) => s.label).sort();
      expect(mergedLabels).toEqual(baseLabels);
    });
  });

  it("does not mutate the original base schedule", () => {
    const base = getContent("en").schedule;
    const originalLabel = base[1].slots[1].label;
    mergeSchedule(base, [makeDbEvent({ id: "apr6-dinner", labelEn: "Changed!" })], "en");
    expect(base[1].slots[1].label).toBe(originalLabel);
  });

  it("overrides an existing base slot label and description", () => {
    const base = getContent("en").schedule;
    const override = makeDbEvent({
      id: "apr6-dinner",
      dayDate: "2026-04-06",
      labelEn: "Updated Dinner",
      descriptionEn: "New venue confirmed!",
      source: "base",
    });
    const merged = mergeSchedule(base, [override], "en");
    const apr6 = merged[1];
    const dinnerSlot = apr6.slots.find((s) => s.id === "apr6-dinner");
    expect(dinnerSlot!.label).toBe("Updated Dinner");
    expect(dinnerSlot!.description).toBe("New venue confirmed!");
  });

  it("overrides use JA fields when locale is ja", () => {
    const base = getContent("ja").schedule;
    const override = makeDbEvent({
      id: "apr6-dinner",
      labelJa: "更新ディナー",
      descriptionJa: "会場決定！",
      source: "base",
    });
    const merged = mergeSchedule(base, [override], "ja");
    const apr6 = merged[1];
    const dinnerSlot = apr6.slots.find((s) => s.id === "apr6-dinner");
    expect(dinnerSlot!.label).toBe("更新ディナー");
    expect(dinnerSlot!.description).toBe("会場決定！");
  });

  it("inserts custom events into the correct day", () => {
    const base = getContent("en").schedule;
    const custom = makeDbEvent({
      id: "custom-pool-party",
      dayDate: "2026-04-10",
      timeLabel: "3:00 PM",
      category: "free",
      labelEn: "Pool Party",
      descriptionEn: null,
      source: "custom",
    });
    const merged = mergeSchedule(base, [custom], "en");
    const apr10 = merged[5];
    const poolSlot = apr10.slots.find((s) => s.id === "custom-pool-party");
    expect(poolSlot).toBeDefined();
    expect(poolSlot!.label).toBe("Pool Party");
    expect(poolSlot!.time).toBe("3:00 PM");
    expect(poolSlot!.category).toBe("free");
  });

  it("sorts merged slots chronologically within a day", () => {
    const base = getContent("en").schedule;
    const customMorning = makeDbEvent({
      id: "custom-breakfast",
      dayDate: "2026-04-10",
      timeLabel: "8:00 AM",
      category: "dinner",
      labelEn: "Breakfast meetup",
      source: "custom",
    });
    const customEvening = makeDbEvent({
      id: "custom-sunset",
      dayDate: "2026-04-10",
      timeLabel: "6:00 PM",
      category: "free",
      labelEn: "Sunset hangout",
      source: "custom",
    });

    const merged = mergeSchedule(base, [customEvening, customMorning], "en");
    const apr10 = merged[5];
    const ids = apr10.slots.map((slot) => slot.id ?? slot.label);
    expect(ids).toEqual([
      "Rest and relax",
      "custom-breakfast",
      "Victor departs",
      "custom-sunset",
    ]);
  });

  it("falls back to English fields when Japanese text is blank", () => {
    const base = getContent("ja").schedule;
    const custom = makeDbEvent({
      id: "custom-dinner",
      dayDate: "2026-04-10",
      timeLabel: "6:00 PM",
      category: "dinner",
      labelEn: "Dinner at L'essence",
      descriptionEn: "Group dinner.",
      labelJa: "",
      descriptionJa: null,
      source: "custom",
    });

    const merged = mergeSchedule(base, [custom], "ja");
    const apr10 = merged[5];
    const dinnerSlot = apr10.slots.find((slot) => slot.id === "custom-dinner");
    expect(dinnerSlot?.label).toBe("Dinner at L'essence");
    expect(dinnerSlot?.description).toBe("Group dinner.");
  });

  it("skips inactive events", () => {
    const base = getContent("en").schedule;
    const inactive = makeDbEvent({
      id: "apr6-dinner",
      labelEn: "Should Not Show",
      active: false,
      source: "base",
    });
    const merged = mergeSchedule(base, [inactive], "en");
    const apr6 = merged[1];
    const dinnerSlot = apr6.slots.find((s) => s.id === "apr6-dinner");
    expect(dinnerSlot!.label).not.toBe("Should Not Show");
  });

  it("updates signupEnabled from override", () => {
    const base = getContent("en").schedule;
    const override = makeDbEvent({
      id: "apr6-dinner",
      signupEnabled: false,
      source: "base",
    });
    const merged = mergeSchedule(base, [override], "en");
    const slot = merged[1].slots.find((s) => s.id === "apr6-dinner");
    expect(slot!.signupEnabled).toBe(false);
  });
});

describe("mergeNotes", () => {
  it("returns DB notes when provided", () => {
    const result = mergeNotes(["base note"], ["db note 1", "db note 2"]);
    expect(result).toEqual(["db note 1", "db note 2"]);
  });

  it("falls back to base notes when DB notes is empty", () => {
    const result = mergeNotes(["base note"], []);
    expect(result).toEqual(["base note"]);
  });

  it("falls back to base notes when DB notes is undefined", () => {
    const result = mergeNotes(["base note"], undefined);
    expect(result).toEqual(["base note"]);
  });
});
