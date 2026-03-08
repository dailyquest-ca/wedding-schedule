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
  it("returns base schedule unchanged when no DB events", () => {
    const base = getContent("en").schedule;
    const merged = mergeSchedule(base, [], "en");
    expect(merged).toEqual(base);
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
