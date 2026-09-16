import { existsSync } from "node:fs";
import path from "node:path";

import concerts from "@/assets/contents/concerts.json";
import type { Concert } from "@/utils/concerts";

/**
 * Guard rails on the concert data itself (CPMB-17).
 *
 * `yarn validate` already runs in CI on the data workflow, but only when a
 * content file changes. These tests run on every push, and they cover what a
 * schema cannot say: that no filler text survived the design phase, and that
 * a date can always be read — the whole upcoming/past split depends on it.
 */

/** Wording used while the season was still being written. */
const FILLER = [/à confirmer/i, /à préciser/i, /lieu à venir/i, /date de la saison en cours/i, /lorem ipsum/i];

const text = (concert: Concert): string =>
  [
    concert.title,
    concert.location,
    concert.description ?? "",
    ...(concert.programme ?? []),
    ...(concert.performers ?? []),
  ].join(" ");

describe("concerts", () => {
  it("should carry no filler text left from the design phase", () => {
    const guilty = concerts.filter((concert) => FILLER.some((pattern) => pattern.test(text(concert))));

    expect(guilty.map((concert) => concert.slug)).toEqual([]);
  });

  it("should give every concert at least one readable date", () => {
    const unreadable = concerts.filter(
      (concert) => concert.date.length === 0 || concert.date.some((date) => Number.isNaN(new Date(date).getTime()))
    );

    expect(unreadable.map((concert) => concert.slug)).toEqual([]);
  });

  it("should keep every slug unique and URL-friendly", () => {
    const slugs = concerts.map((concert) => concert.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.filter((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))).toEqual([]);
  });

  it("should point at posters that exist in public/", () => {
    const missing = concerts
      .filter((concert) => concert.media)
      .filter((concert) => !existsSync(path.join(process.cwd(), "public", concert.media!)));

    expect(missing.map((concert) => concert.slug)).toEqual([]);
  });
});
