import { CONCERTS_BANNER, SOCIAL_IMAGE } from "@/assets/contents/medias";
import { META_DESCRIPTION_LENGTH, pageMetadata } from "@/utils/metadata";

const BASE = { title: "Nos concerts", description: "Les prochains concerts du chœur.", path: "/nos-concerts" };

describe("pageMetadata", () => {
  it("should declare the page's canonical address", () => {
    expect(pageMetadata(BASE).alternates?.canonical).toBe("/nos-concerts");
  });

  it("should leave the choir's name to the layout's title template", () => {
    expect(pageMetadata(BASE).title).toBe("Nos concerts");
  });

  it("should name the choir in the social card, which has no template", () => {
    expect(pageMetadata(BASE).openGraph?.title).toBe("Nos concerts | Chœur des Pays du Mont-Blanc");
  });

  it("should fall back to the choir's photo when the page has no image", () => {
    expect(pageMetadata(BASE).openGraph?.images).toEqual([
      { url: SOCIAL_IMAGE.src, width: SOCIAL_IMAGE.width, height: SOCIAL_IMAGE.height, alt: SOCIAL_IMAGE.alt },
    ]);
  });

  it("should carry the page's own image when it has one", () => {
    const metadata = pageMetadata({ ...BASE, image: CONCERTS_BANNER });

    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: CONCERTS_BANNER.src, alt: CONCERTS_BANNER.alt }),
    ]);
  });

  it("should keep the section pages as websites and the fiches as articles", () => {
    expect(pageMetadata(BASE).openGraph).toMatchObject({ type: "website", locale: "fr_FR" });
    expect(pageMetadata({ ...BASE, type: "article" }).openGraph).toMatchObject({ type: "article" });
  });

  it("should only declare keywords when the page gives some", () => {
    expect(pageMetadata(BASE).keywords).toBeUndefined();
    expect(pageMetadata({ ...BASE, keywords: ["chœur"] }).keywords).toEqual(["chœur"]);
  });

  it("should cut descriptions before a search engine does", () => {
    expect(META_DESCRIPTION_LENGTH).toBeLessThanOrEqual(160);
  });
});
