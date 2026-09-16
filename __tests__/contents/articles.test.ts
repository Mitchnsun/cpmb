import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import articles from "@/assets/contents/articles.json";

const MEDIA = articles.flatMap((article) => article.media);

/** Native dimensions read straight from the file header — JPEG and PNG only. */
const nativeSize = (url: string): { width: number; height: number } => {
  const data = readFileSync(path.join(process.cwd(), "public", url));

  if (data.readUInt32BE(0) === 0x89504e47) {
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }

  let offset = 2;
  while (offset < data.length) {
    if (data[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = data[offset + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    offset += 2 + data.readUInt16BE(offset + 2);
  }

  throw new Error(`Unreadable image header: ${url}`);
};

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
