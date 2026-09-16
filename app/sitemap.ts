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

/**
 * Last date of a concert, as the day it stopped changing. A concert page is
 * written once and only edited around its performances.
 */
const lastPerformance = (concert: Concert): Date | undefined => {
  const times = concert.date.map((date) => new Date(date).getTime()).filter((time) => Number.isFinite(time));

  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = SITEMAP_LINKS.map(({ href }) => ({
    url: absoluteUrl(href),
    ...(PAGE_RANK[href] ?? DEFAULT_RANK),
  }));

  const concertPages = concerts.map((concert: Concert) => ({
    url: absoluteUrl(`/nos-concerts/${concert.slug}`),
    lastModified: lastPerformance(concert),
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
