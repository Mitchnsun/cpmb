/**
 * Format an ISO date string like "2024-12-13T20:00:00+01:00" into
 * French format: "12 décembre 2024 à 18h30".
 * For date-only strings like "2024-12-13", returns: "12 décembre 2024".
 * - Uses Europe/Paris timezone so displayed time matches local FR time.
 * - Pads minutes to 2 digits and shows hours without leading zero.
 * - Only displays time if the original string contains time information.
 */
export function formatFrenchDateTime(isoString: string, options?: { timeZone?: string }): string {
  if (!isoString) return "";
  const timeZone = options?.timeZone ?? "Europe/Paris";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";

  // Check if the original string contains time information
  const hasTime = isoString.includes("T");

  // Intl for day/month/year in French
  const dtf = new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const parts = dtf.formatToParts(d);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  // If no time in original string, return date only
  if (!hasTime) {
    return `${Number(day)} ${month} ${year}`;
  }

  // Separate formatter for time (24h)
  const time = new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(d)
    .replace(/^0/, "") // remove leading zero in hour (e.g., 08 → 8)
    .replace(":", "h"); // 18:30 → 18h30

  return `${Number(day)} ${month} ${year} à ${time}`;
}

export default formatFrenchDateTime;
