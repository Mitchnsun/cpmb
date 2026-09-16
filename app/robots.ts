import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/utils/site";

/**
 * `robots.txt` (CPMB-18).
 *
 * Everything published here is meant to be found: the whole site is open to
 * crawlers, and the only thing worth saying is where the sitemap lives.
 */

/** Prerendered with the rest of the site, served as a file. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
