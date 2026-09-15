import { nextConcertDate, splitConcertsByDate } from "@/utils/concerts";

type Concert = Parameters<typeof splitConcertsByDate>[0][number];

const NOW = new Date("2025-06-15T12:00:00Z").getTime();

const concert = (slug: string, dates: string[]): Concert =>
  ({
    title: slug,
    slug,
    date: dates,
    description: "",
    location: "",
    media: "",
  }) as unknown as Concert;

describe("splitConcertsByDate", () => {
  it("should put a concert whose dates are all past into past", () => {
    const old = concert("noel-2024", ["2024-12-22T17:30:00+01:00"]);

    const { upcoming, past } = splitConcertsByDate([old], NOW);

    expect(upcoming).toEqual([]);
    expect(past).toEqual([old]);
  });

  it("should put a concert whose dates are all ahead into upcoming", () => {
    const next = concert("noel-2025", ["2025-12-12T18:00:00+01:00"]);

    const { upcoming, past } = splitConcertsByDate([next], NOW);

    expect(upcoming).toEqual([next]);
    expect(past).toEqual([]);
  });

  it("should keep a multi-date concert upcoming while one of its dates is ahead", () => {
    const straddling = concert("vivaldi", ["2025-06-14T20:30:00+02:00", "2025-06-16T18:00:00+02:00"]);

    const { upcoming, past } = splitConcertsByDate([straddling], NOW);

    expect(upcoming).toEqual([straddling]);
    expect(past).toEqual([]);
  });

  it("should order upcoming concerts by their next date, soonest first", () => {
    const later = concert("later", ["2025-12-12T18:00:00+01:00"]);
    const sooner = concert("sooner", ["2025-07-01T18:00:00+02:00"]);

    const { upcoming } = splitConcertsByDate([later, sooner], NOW);

    expect(upcoming.map(({ slug }) => slug)).toEqual(["sooner", "later"]);
  });

  it("should order past concerts by their last date, most recent first", () => {
    const older = concert("older", ["2023-12-08T18:00:00+01:00"]);
    const recent = concert("recent", ["2024-12-22T17:30:00+01:00"]);

    const { past } = splitConcertsByDate([older, recent], NOW);

    expect(past.map(({ slug }) => slug)).toEqual(["recent", "older"]);
  });

  it("should ignore unparsable dates", () => {
    const broken = concert("broken", ["pas-une-date", "2025-12-12T18:00:00+01:00"]);

    const { upcoming } = splitConcertsByDate([broken], NOW);

    expect(upcoming).toEqual([broken]);
  });

  it("should handle an empty list", () => {
    expect(splitConcertsByDate([], NOW)).toEqual({ upcoming: [], past: [] });
  });
});

describe("nextConcertDate", () => {
  it("should return the earliest date still ahead", () => {
    const next = concert("gloria", ["2025-06-14T20:30:00+02:00", "2025-06-16T18:00:00+02:00"]);

    expect(nextConcertDate(next, NOW)).toBe("2025-06-16T18:00:00+02:00");
  });

  it("should skip the dates already passed", () => {
    const next = concert("gloria", ["2025-06-14T20:30:00+02:00", "2025-12-12T18:00:00+01:00"]);

    expect(nextConcertDate(next, NOW)).toBe("2025-12-12T18:00:00+01:00");
  });

  it("should return undefined when every date is behind us", () => {
    const old = concert("noel-2024", ["2024-12-22T17:30:00+01:00"]);

    expect(nextConcertDate(old, NOW)).toBeUndefined();
  });

  it("should ignore an unparsable date", () => {
    const broken = concert("broken", ["pas-une-date", "2025-12-12T18:00:00+01:00"]);

    expect(nextConcertDate(broken, NOW)).toBe("2025-12-12T18:00:00+01:00");
  });
});
