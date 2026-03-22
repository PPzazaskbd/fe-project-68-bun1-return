import {
  createDateRangeSearchParams,
  normalizeDateRange,
} from "./dateRangeParams";

describe("dateRangeParams", () => {
  it("normalizes missing or reversed dates into a valid range", () => {
    expect(normalizeDateRange(null, null, "2026-04-01")).toEqual({
      checkIn: "2026-04-01",
      checkOut: "2026-04-02",
    });

    expect(
      normalizeDateRange("2026-04-10", "2026-04-08", "2026-04-01"),
    ).toEqual({
      checkIn: "2026-04-10",
      checkOut: "2026-04-11",
    });
  });

  it("preserves unrelated query params when writing a date range", () => {
    const nextParams = createDateRangeSearchParams(
      new URLSearchParams("search=beach&page=2"),
      {
        checkIn: "2026-04-03",
        checkOut: "2026-04-06",
      },
    );

    expect(nextParams.get("search")).toBe("beach");
    expect(nextParams.get("page")).toBe("2");
    expect(nextParams.get("checkIn")).toBe("2026-04-03");
    expect(nextParams.get("checkOut")).toBe("2026-04-06");
  });
});
