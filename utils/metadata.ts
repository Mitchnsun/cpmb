import type { Metadata } from "next";

import { type SiteImage, SOCIAL_IMAGE } from "@/assets/contents/medias";
import { SITE_NAME } from "@/utils/site";

/**
 * Metadata of a page (CPMB-18).
 *
 * Every page needs the same three things — a canonical address, a title and
 * a description, an Open Graph card — and Next does not merge the
 * `openGraph` of a page into the one declared in the layout: it replaces it.
 * Writing the block by hand on each page is how a `siteName` or an image
 * silently goes missing, so it is built here instead, once.
 *
 * `path` is relative: `metadataBase`, declared in the layout, turns it into
 * the absolute address a crawler and a messaging app both need.
 */

/**
 * Where a description is cut. Search engines show around 160 characters of
 * it; past that the sentence is trimmed on their side, mid-word.
 */
export const META_DESCRIPTION_LENGTH = 155;

export interface PageMetadataOptions {
  /** Short title of the page; the layout appends the choir's name. */
  title: string;
  description: string;
  /** Path of the page, from the root: "/nos-concerts". */
  path: string;
  /** Image of the social card. The choir's photo when the page has none. */
  image?: SiteImage;
  keywords?: string[];
  /** An article — a concert, a press clipping — rather than a section. */
  type?: "website" | "article";
}

export const pageMetadata = ({
  title,
  description,
  path,
  image = SOCIAL_IMAGE,
  keywords,
  type = "website",
}: PageMetadataOptions): Metadata => ({
  title,
  description,
  ...(keywords ? { keywords } : {}),
  alternates: { canonical: path },
  openGraph: {
    type,
    locale: "fr_FR",
    siteName: SITE_NAME,
    url: path,
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
  },
});
