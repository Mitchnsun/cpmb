import type { Concert } from "@/utils/concerts";
import { PARIS } from "@/utils/formatDate";

/**
 * iCalendar export of a concert (CPMB-12).
 *
 * One `VEVENT` per performance, so a concert given twice is a single file
 * holding two entries. Times are written as Paris wall-clock times carried
 * by the embedded `VTIMEZONE`, which is what Apple Calendar, Google Calendar
 * and Outlook all read the same way — an offset baked into a UTC stamp would
 * drift the day a daylight-saving change fell between the export and the
 * concert.
 */

/** RFC 5545 separates lines with CRLF, whatever the platform. */
const CRLF = "\r\n";

/** RFC 5545 asks for lines of at most 75 octets, continuations excluded. */
const MAX_LINE_OCTETS = 75;

/** Concerts carry no end time: a choir concert is counted as an hour and a half. */
const DEFAULT_DURATION_MS = 90 * 60 * 1000;

/** What the route serves the file as. */
export const CALENDAR_CONTENT_TYPE = "text/calendar; charset=utf-8";

/** Explicit file name, so the download is recognisable in a downloads folder. */
export const icsFileName = (slug: string): string => `${slug}.ics`;

const encoder = new TextEncoder();

/** Escapes the characters that carry a meaning in a property value. */
const escapeText = (value: string): string =>
  value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll(/\r?\n/g, "\\n");

/** Folds a long line, continuations starting with a single space. */
const foldLine = (line: string): string => {
  const chunks: string[] = [];
  let current = "";
  let octets = 0;

  [...line].forEach((char) => {
    const size = encoder.encode(char).length;
    /* A continuation line spends one of its octets on its leading space. */
    const limit = chunks.length === 0 ? MAX_LINE_OCTETS : MAX_LINE_OCTETS - 1;

    if (octets + size > limit) {
      chunks.push(current);
      current = "";
      octets = 0;
    }

    current += char;
    octets += size;
  });

  chunks.push(current);
  return chunks.join(`${CRLF} `);
};

/** Wall-clock parts of an instant, read in Paris. */
const parisParts = (time: number): Record<string, string> =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(new Date(time))
    .reduce<Record<string, string>>((acc, part) => ({ ...acc, [part.type]: part.value }), {});

/** "2025-06-14T20:30:00+02:00" → "20250614T203000", in Paris. */
const parisStamp = (time: number): string => {
  const { year, month, day, hour, minute, second } = parisParts(time);
  return `${year}${month}${day}T${hour}${minute}${second}`;
};

/** "2025-06-14T20:30:00+02:00" → "20250614", in Paris. */
const parisDateStamp = (time: number): string => parisStamp(time).slice(0, 8);

/** UTC stamp, the form `DTSTAMP` takes. */
const utcStamp = (time: number): string => `${new Date(time).toISOString().replaceAll(/[-:]|\.\d{3}/g, "")}`;

/** Paris timezone, described in the file itself so no client has to guess it. */
const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${PARIS}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

/**
 * Start and end of a performance. A date with no time is an all-day event:
 * a calendar would otherwise place it at midnight.
 */
const eventDates = (isoString: string): string[] => {
  const time = new Date(isoString).getTime();

  if (!isoString.includes("T")) {
    return [
      `DTSTART;VALUE=DATE:${parisDateStamp(time)}`,
      `DTEND;VALUE=DATE:${parisDateStamp(time + 24 * 60 * 60 * 1000)}`,
    ];
  }

  return [`DTSTART;TZID=${PARIS}:${parisStamp(time)}`, `DTEND;TZID=${PARIS}:${parisStamp(time + DEFAULT_DURATION_MS)}`];
};

export interface IcsOptions {
  /** Absolute address of the concert page, carried by `URL` and `DESCRIPTION`. */
  url: string;
  /** Reference instant of the export (`DTSTAMP`), passed in so this stays pure. */
  now: number;
}

/**
 * The whole calendar file of a concert, ready to be served.
 * A date that cannot be read is skipped rather than exported broken.
 */
export const buildConcertIcs = (concert: Concert, { url, now }: IcsOptions): string => {
  const events = concert.date
    .filter((date) => Number.isFinite(new Date(date).getTime()))
    .map((date, index) => [
      "BEGIN:VEVENT",
      `UID:${concert.slug}-${index + 1}@choeurdespaysdumontblanc.fr`,
      `DTSTAMP:${utcStamp(now)}`,
      ...eventDates(date),
      `SUMMARY:${escapeText(concert.title)}`,
      `LOCATION:${escapeText(concert.location)}`,
      `DESCRIPTION:${escapeText(`Chœur des Pays du Mont-Blanc — ${url}`)}`,
      `URL:${url}`,
      "END:VEVENT",
    ])
    .flat();

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Chœur des Pays du Mont-Blanc//Concerts//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...VTIMEZONE,
    ...events,
    "END:VCALENDAR",
    "",
  ]
    .map(foldLine)
    .join(CRLF);
};
