import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import articles from "@/assets/contents/articles.json";
import artists from "@/assets/contents/artists.json";
import concerts from "@/assets/contents/concerts.json";
import { SITEMAP_LINKS } from "@/assets/contents/navigation";
import { SITE_URL } from "@/utils/site";

const ENTRIES = sitemap();
const URLS = ENTRIES.map((entry) => entry.url);

describe("sitemap", () => {
  it("should list every page the site prerenders, and nothing else", () => {
    const expected = SITEMAP_LINKS.length + concerts.length + articles.length + Object.keys(artists).length;

    expect(ENTRIES).toHaveLength(expected);
  });

  it("should give every entry an absolute address", () => {
    expect(URLS.filter((url) => !url.startsWith(`${SITE_URL}/`))).toEqual([]);
  });

  it("should follow the navigation for the static pages", () => {
    SITEMAP_LINKS.forEach(({ href }) => {
      expect(URLS).toContain(`${SITE_URL}${href}`);
    });
  });

  it("should carry one entry per concert", () => {
    concerts.forEach((concert) => {
      expect(URLS).toContain(`${SITE_URL}/nos-concerts/${concert.slug}`);
    });
  });

  it("should date nothing: a concert's date is not the day its page was written", () => {
    expect(ENTRIES.filter((entry) => entry.lastModified)).toEqual([]);
  });

  it("should rank the agenda above the legal notice", () => {
    const rank = (path: string) => ENTRIES.find((entry) => entry.url === `${SITE_URL}${path}`)?.priority ?? 0;

    expect(rank("/nos-concerts")).toBeGreaterThan(rank("/mentions-legales"));
  });

  it("should never list the same address twice", () => {
    expect(new Set(URLS).size).toBe(URLS.length);
  });
});

describe("robots", () => {
  it("should open the whole site and point at the sitemap", () => {
    expect(robots()).toEqual({
      rules: [{ userAgent: "*", allow: "/" }],
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
  });
});
