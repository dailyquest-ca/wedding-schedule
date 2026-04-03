import { describe, it, expect, vi, beforeEach } from "vitest";

const dbMock = vi.fn(async () => []);

vi.mock("@/lib/db", () => ({
  getDb: () => dbMock,
}));

import { addSignup } from "@/lib/signup/queries";

function toSqlText(strings: readonly string[]): string {
  return strings.join("$");
}

describe("addSignup", () => {
  beforeEach(() => {
    dbMock.mockClear();
  });

  it("uses insert-if-missing pattern without ON CONFLICT", async () => {
    await addSignup("apr6-dinner", "anna");

    expect(dbMock).toHaveBeenCalledTimes(1);
    const [stringsArg] = dbMock.mock.calls[0] as [readonly string[]];
    const sqlText = toSqlText(stringsArg).toUpperCase();

    expect(sqlText).toContain("INSERT INTO EVENT_SIGNUPS");
    expect(sqlText).toContain("WHERE NOT EXISTS");
    expect(sqlText).not.toContain("ON CONFLICT");
  });
});
