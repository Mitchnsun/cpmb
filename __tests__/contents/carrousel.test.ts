import { existsSync } from "node:fs";
import path from "node:path";

import { CARROUSEL_IMAGES } from "@/assets/contents/carrousel";

import { nativeSize } from "./nativeSize";

describe("carrousel", () => {
  it("should point at files that exist in public/", () => {
    CARROUSEL_IMAGES.forEach(({ src }) => {
      expect(existsSync(path.join(process.cwd(), "public", src))).toBe(true);
    });
  });

  it("should give every photo a written alt", () => {
    expect(CARROUSEL_IMAGES.filter(({ alt }) => alt.trim() !== "")).toHaveLength(CARROUSEL_IMAGES.length);
  });

  it("should declare each photo's true dimensions, so the slide reserves the right box", () => {
    const wrong = CARROUSEL_IMAGES.filter(({ src, width, height }) => {
      const native = nativeSize(src);
      return native.width !== width || native.height !== height;
    }).map(({ src }) => src);

    expect(wrong).toEqual([]);
  });

  it("should load no photo with priority: the home hero is the only one on the site", () => {
    expect(CARROUSEL_IMAGES.filter(({ priority }) => priority)).toEqual([]);
  });
});
