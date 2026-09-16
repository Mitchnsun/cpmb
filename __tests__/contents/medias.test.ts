import { existsSync } from "node:fs";
import path from "node:path";

import {
  CHOIR_PORTRAIT,
  CONCERTS_BANNER,
  CONTACT_BANNER,
  HOME_HERO,
  LOGO,
  NOT_FOUND_BANNER,
  PARTNER_LOGOS,
  posterAlt,
  PRESENTATION_BANNER,
  type SiteImage,
  SOCIAL_IMAGE,
} from "@/assets/contents/medias";

const ALL_IMAGES: SiteImage[] = [
  LOGO,
  HOME_HERO,
  CHOIR_PORTRAIT,
  CONCERTS_BANNER,
  CONTACT_BANNER,
  PRESENTATION_BANNER,
  NOT_FOUND_BANNER,
  SOCIAL_IMAGE,
  ...PARTNER_LOGOS,
];

describe("medias", () => {
  it("should point at files that exist in public/", () => {
    ALL_IMAGES.forEach(({ src }) => {
      expect(existsSync(path.join(process.cwd(), "public", src))).toBe(true);
    });
  });

  it("should declare dimensions on every image, so nothing shifts on load", () => {
    expect(ALL_IMAGES.filter(({ width, height }) => width > 0 && height > 0)).toHaveLength(ALL_IMAGES.length);
  });

  it("should give every image a written alt", () => {
    expect(ALL_IMAGES.filter(({ alt }) => alt.trim() !== "")).toHaveLength(ALL_IMAGES.length);
  });

  it("should load exactly one image with priority: the home hero", () => {
    expect(ALL_IMAGES.filter(({ priority }) => priority)).toEqual([HOME_HERO]);
  });

  it("should keep the deliberate crops of the banner photos", () => {
    expect(HOME_HERO.objectPosition).toBe("center");
    expect(CHOIR_PORTRAIT.objectPosition).toBe("center 42%");
    expect(CONCERTS_BANNER.objectPosition).toBe("center 40%");
    expect(CONTACT_BANNER.objectPosition).toBe("center 35%");
    expect(PRESENTATION_BANNER.objectPosition).toBe("center 35%");
  });

  it("should build a poster alt from the concert title", () => {
    expect(posterAlt("Concert de Noël")).toBe("Affiche du concert : Concert de Noël");
  });
});
