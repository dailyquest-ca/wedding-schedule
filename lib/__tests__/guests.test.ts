import { describe, it, expect } from "vitest";
import { GUESTS, getGuestById, getDisplayName } from "@/lib/guests";

describe("GUESTS", () => {
  it("contains 21 guests", () => {
    expect(GUESTS).toHaveLength(21);
  });

  it("every guest has a unique id", () => {
    const ids = GUESTS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marks Anna, Zak, Takaaki, Yoko as family exceptions", () => {
    const exceptions = GUESTS.filter((g) => g.isFamilyException).map((g) => g.firstName);
    expect(exceptions).toEqual(expect.arrayContaining(["Anna", "Zak", "Takaaki", "Yoko"]));
    expect(exceptions).toHaveLength(4);
  });
});

describe("getGuestById", () => {
  it("returns the guest for a valid id", () => {
    expect(getGuestById("anna")?.firstName).toBe("Anna");
  });

  it("returns undefined for an unknown id", () => {
    expect(getGuestById("nobody")).toBeUndefined();
  });
});

describe("getDisplayName", () => {
  it("returns plain first name in English", () => {
    expect(getDisplayName({ id: "ishan", firstName: "Ishan", isFamilyException: false }, "en")).toBe("Ishan");
  });

  it("appends 様 in Japanese for non-family guests", () => {
    expect(getDisplayName({ id: "ishan", firstName: "Ishan", isFamilyException: false }, "ja")).toBe("Ishan様");
  });

  it("does NOT append 様 for family exceptions in Japanese", () => {
    expect(getDisplayName({ id: "anna", firstName: "Anna", isFamilyException: true }, "ja")).toBe("Anna");
  });
});
