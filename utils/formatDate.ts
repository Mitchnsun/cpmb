/**
 * French date formatting used across the site.
 *
 * Three levels, all built on the same `Intl` parts so a date reads the same
 * everywhere: the date alone, the time alone, and the two joined. Everything
 * is rendered in the `Europe/Paris` timezone, so the displayed time matches
 * the local time of the concert regardless of where the page is built.
 */

const PARIS = "Europe/Paris";

interface FormatOptions {
  timeZone?: string;
}

interface DateParts {
  day: string;
  month: string;
  year: string;
}

/** Day / month / year of an ISO string, or `null` if it isn't a valid date. */
const dateParts = (isoString: string, timeZone: string): DateParts | null => {
  if (!isoString) return null;

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("fr-FR", { timeZone, day: "2-digit", month: "long", year: "numeric" })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => ({ ...acc, [part.type]: part.value }), {});

  return { day: String(Number(parts.day ?? "")), month: parts.month ?? "", year: parts.year ?? "" };
};

/**
 * "2025-06-14T20:30:00+02:00" → "14 juin 2025".
 * Returns "" for an empty or invalid input.
 */
export function formatFrenchDate(isoString: string, options?: FormatOptions): string {
  const parts = dateParts(isoString, options?.timeZone ?? PARIS);
  return parts ? `${parts.day} ${parts.month} ${parts.year}` : "";
}

/**
 * "2025-06-14T20:30:00+02:00" → "20h30".
 * A date-only string ("2025-06-14") carries no time: returns "".
 */
export function formatFrenchTime(isoString: string, options?: FormatOptions): string {
  if (!isoString.includes("T")) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: options?.timeZone ?? PARIS,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/^0/, "") // 08h30 → 8h30
    .replace(":", "h");
}

/**
 * "2024-12-13T20:00:00+01:00" → "13 décembre 2024 à 20h00".
 * A date-only string returns the date alone.
 */
export function formatFrenchDateTime(isoString: string, options?: FormatOptions): string {
  const date = formatFrenchDate(isoString, options);
  if (!date) return "";

  const time = formatFrenchTime(isoString, options);
  return time ? `${date} à ${time}` : date;
}

/** Joins days the French way: ["a", "b", "c"] → "a, b et c". */
const joinDays = (days: readonly string[]): string =>
  days.length > 1 ? `${days.slice(0, -1).join(", ")} et ${days.at(-1)}` : (days[0] ?? "");

/**
 * Several dates of a single concert, as one readable line — the epic's rule
 * is "dates spelled out in French". Consecutive dates sharing a month state
 * it once: ["2025-06-14", "2025-06-15"] → "14 et 15 juin 2025".
 */
export function formatFrenchDateList(isoStrings: readonly string[], options?: FormatOptions): string {
  const timeZone = options?.timeZone ?? PARIS;
  const groups: { label: string; days: string[] }[] = [];

  isoStrings.forEach((isoString) => {
    const parts = dateParts(isoString, timeZone);
    if (!parts) return;

    const label = `${parts.month} ${parts.year}`;
    const current = groups.at(-1);

    if (current?.label === label) current.days.push(parts.day);
    else groups.push({ label, days: [parts.day] });
  });

  return groups.map(({ label, days }) => `${joinDays(days)} ${label}`).join(", ");
}

export default formatFrenchDateTime;
