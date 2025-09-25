/**
 * Truncate a string to a maximum length without cutting through a word.
 * Preference: cut at the next space after the limit; if none, cut at the last space before the limit;
 * if still none (single long word), hard cut at the limit. Append ellipsis when truncated.
 */
export function truncateAtWord(input: string, max = 100, ellipsis = "..."): string {
  if (typeof input !== "string") return "";

  const text = input.trim().replace(/\s+/g, " "); // normalize spaces/newlines
  if (text.length <= max) return text;

  // Try to cut at the next space after the limit
  const nextSpace = text.indexOf(" ", max);
  if (nextSpace !== -1) {
    return text.slice(0, nextSpace).trimEnd() + ellipsis;
  }

  // No space after: try last space before limit
  const lastSpaceBefore = text.lastIndexOf(" ", max);
  if (lastSpaceBefore !== -1 && lastSpaceBefore > 0) {
    return text.slice(0, lastSpaceBefore).trimEnd() + ellipsis;
  }

  // No spaces at all around: hard cut
  const cut = text.slice(0, max).trimEnd();
  return cut + ellipsis;
}

export default truncateAtWord;
