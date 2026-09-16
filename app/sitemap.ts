import type { MetadataRoute } from "next";

import articles from "@/assets/contents/articles.json";
import artists from "@/assets/contents/artists.json";
import concerts from "@/assets/contents/concerts.json";
import { SITEMAP_LINKS } from "@/assets/contents/navigation";
import { type Concert } from "@/utils/concerts";
import { absoluteUrl } from "@/utils/site";

/**
 * `sitemap.xml`, built from the same data the pages are (CPMB-18).
 *
 * The static pages come from `navigation.ts`, the single navigation source,
 * so a page added to the menu is declared here without a second edit. The
 * rest is derived: one entry per concert, per press article and per artist,
 * exactly the addresses `generateStaticParams` prerenders.
 */

/** Prerendered with the rest of the site, served as a file. */
export const dynamic = "force-static";

/**
 * How often a section actually changes, and how much of the site it carries.
 * Anything not named here is a page that barely moves.
 */
const PAGE_RANK: Readonly<Record<string, { changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }>> = {
  "/": { changeFrequency: "weekly", priority: 1 },
  "/nos-concerts": { changeFrequency: "weekly", priority: 0.9 },
  "/presentation": { changeFrequency: "monthly", priority: 0.8 },
  "/presse": { changeFrequency: "monthly", priority: 0.6 },
  "/contact": { changeFrequency: "yearly", priority: 0.7 },
  "/mentions-legales": { changeFrequency: "yearly", priority: 0.2 },
};

const DEFAULT_RANK = { changeFrequency: "yearly", priority: 0.5 } as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = SITEMAP_LINKS.map(({ href }) => ({
    url: absoluteUrl(href),
    ...(PAGE_RANK[href] ?? DEFAULT_RANK),
  }));

  /*
   * No `lastModified` anywhere: the only date the data holds is the date of
   * the concert, which is not the day its page was last written — the three
   * concerts imported in September 2026 happened in 2025 and would be
   * announced as a year stale. A build stamp would be worse still: it moves
   * on every deploy, whether or not a single page changed.
   */
  const concertPages = concerts.map((concert: Concert) => ({
    url: absoluteUrl(`/nos-concerts/${concert.slug}`),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const articlePages = articles.map(({ slug }) => ({
    url: absoluteUrl(`/presse/${slug}`),
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  const artistPages = Object.keys(artists).map((slug) => ({
    url: absoluteUrl(`/presentation/${slug}`),
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  return [...pages, ...concertPages, ...articlePages, ...artistPages];
}
