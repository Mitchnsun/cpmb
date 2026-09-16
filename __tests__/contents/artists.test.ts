import { existsSync } from "node:fs";
import path from "node:path";

import artists from "@/assets/contents/artists.json";

import { nativeSize } from "./nativeSize";

const ENTRIES = Object.entries(artists);

describe("artists", () => {
  it("should key every artist by its URL segment", () => {
    ENTRIES.forEach(([slug]) => {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    });
  });

  it("should point at portraits that exist in public/", () => {
    ENTRIES.forEach(([, { media }]) => {
      expect(existsSync(path.join(process.cwd(), "public", media))).toBe(true);
    });
  });

  it("should give every portrait a name, a written alt and some text", () => {
    ENTRIES.forEach(([, { name, alt, text }]) => {
      expect(name.trim()).not.toBe("");
      expect(alt.trim()).not.toBe("");
      expect(text.length).toBeGreaterThan(0);
    });
  });

  it("should declare each portrait's true dimensions, so its box is reserved before it loads", () => {
    // Two of the three portraits are square, not the 2:3 a single declared
    // ratio would assume: the box would collapse on load and push the
    // biography up under it.
    const wrong = ENTRIES.filter(([, { media, width, height }]) => {
      const native = nativeSize(media);
      return native.width !== width || native.height !== height;
    }).map(([slug]) => slug);

    expect(wrong).toEqual([]);
  });
});
