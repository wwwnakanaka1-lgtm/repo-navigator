import { describe, expect, it } from "vitest";

import { formatDateTime, formatPercent } from "@/lib/format";

describe("formatPercent", () => {
  it("rounds values", () => {
    expect(formatPercent(72.4)).toBe("72%");
    expect(formatPercent(72.6)).toBe("73%");
  });
});

describe("formatDateTime", () => {
  it("returns fallback text for null values", () => {
    expect(formatDateTime(null)).toBe("No commit data");
  });
});
