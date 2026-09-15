import type { Concert } from "@/utils/concerts";
import { buildConcertIcs, CALENDAR_CONTENT_TYPE, icsFileName } from "@/utils/ics";

const NOW = new Date("2025-05-01T10:00:00Z").getTime();
const URL = "https://choeurdespaysdumontblanc.fr/nos-concerts/gloria";

const concert = (dates: string[], extra: Partial<Concert> = {}): Concert =>
  ({
    title: "Concert Vivaldi Jenkins",
    slug: "gloria",
    date: dates,
    location: "Boëge et Saint-Gervais-les-Bains, France",
    media: "/concerts/affiche.jpg",
    ...extra,
  }) as unknown as Concert;

const build = (dates: string[], extra: Partial<Concert> = {}) =>
  buildConcertIcs(concert(dates, extra), { url: URL, now: NOW });

describe("buildConcertIcs", () => {
  it("should wrap the events in a calendar", () => {
    const ics = build(["2025-06-14T20:30:00+02:00"]);

    expect(ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("should separate every line with CRLF, as the format requires", () => {
    expect(build(["2025-06-14T20:30:00+02:00"])).not.toMatch(/[^\r]\n/);
  });

  it("should carry the Paris timezone so no client has to guess it", () => {
    const ics = build(["2025-06-14T20:30:00+02:00"]);

    expect(ics).toContain("BEGIN:VTIMEZONE\r\nTZID:Europe/Paris");
    expect(ics).toContain("DTSTART;TZID=Europe/Paris:20250614T203000");
  });

  it("should count an hour and a half for a concert with no end time", () => {
    expect(build(["2025-06-14T20:30:00+02:00"])).toContain("DTEND;TZID=Europe/Paris:20250614T220000");
  });

  it("should write one event per performance, each with its own stable identifier", () => {
    const ics = build(["2025-06-14T20:30:00+02:00", "2025-06-15T18:00:00+02:00"]);

    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain("UID:gloria-1@choeurdespaysdumontblanc.fr");
    expect(ics).toContain("UID:gloria-2@choeurdespaysdumontblanc.fr");
  });

  it("should carry title, venue and a link back to the concert page", () => {
    const ics = build(["2025-06-14T20:30:00+02:00"]);

    expect(ics).toContain("SUMMARY:Concert Vivaldi Jenkins");
    expect(ics).toContain("LOCATION:Boëge et Saint-Gervais-les-Bains\\, France");
    expect(ics).toContain(`URL:${URL}`);
    expect(ics).toContain(URL);
  });

  it("should stamp the export with the reference instant", () => {
    expect(build(["2025-06-14T20:30:00+02:00"])).toContain("DTSTAMP:20250501T100000Z");
  });

  it("should turn a date with no time into an all-day event", () => {
    const ics = build(["2025-12-12"]);

    expect(ics).toContain("DTSTART;VALUE=DATE:20251212");
    expect(ics).toContain("DTEND;VALUE=DATE:20251213");
  });

  it("should escape the characters that carry a meaning in the format", () => {
    const ics = build(["2025-06-14T20:30:00+02:00"], { title: "Noël; Gloria, extraits\nSuite" } as Partial<Concert>);

    expect(ics).toContain("SUMMARY:Noël\\; Gloria\\, extraits\\nSuite");
  });

  it("should fold a line longer than 75 octets", () => {
    const ics = build(["2025-06-14T20:30:00+02:00"], { title: "Concert ".repeat(20) } as Partial<Concert>);

    ics.split("\r\n").forEach((line) => {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    });
    expect(ics).toContain("\r\n ");
  });

  it("should skip a date that cannot be read rather than export it broken", () => {
    const ics = build(["pas-une-date", "2025-06-14T20:30:00+02:00"]);

    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
  });

  it("should name the file after the concert and serve it as a calendar", () => {
    expect(icsFileName("gloria")).toBe("gloria.ics");
    expect(CALENDAR_CONTENT_TYPE).toBe("text/calendar; charset=utf-8");
  });
});
