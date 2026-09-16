import { existsSync } from "node:fs";
import path from "node:path";

import articles from "@/assets/contents/articles.json";

import { nativeSize } from "./nativeSize";

const MEDIA = articles.flatMap((article) => article.media);

describe("articles", () => {
  it("should point at files that exist in public/", () => {
    MEDIA.forEach(({ url }) => {
      expect(existsSync(path.join(process.cwd(), "public", url))).toBe(true);
    });
  });

  it("should give every clipping a written alt", () => {
    expect(MEDIA.filter(({ alt }) => alt.trim() !== "")).toHaveLength(MEDIA.length);
  });

  it("should declare each clipping's true dimensions, so its box is reserved before it loads", () => {
    // The scans range from 0.72 to 2.16 in ratio: one declared shape for all
    // of them would reserve the wrong box and shift the page on load.
    const wrong = MEDIA.filter(({ url, width, height }) => {
      const native = nativeSize(url);
      return native.width !== width || native.height !== height;
    });

    expect(wrong).toEqual([]);
  });

  it("should keep every slug unique, since it is the URL segment", () => {
    const slugs = articles.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
