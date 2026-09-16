import type { NextConfig } from "next";

import { legacyRedirects } from "./utils/legacyRedirects";

const nextConfig: NextConfig = {
  /**
   * Addresses of the Joomla site this one replaces (CPMB-18).
   *
   * `statusCode: 301` rather than `permanent: true`, which would answer 308:
   * the ticket asks for 301, and every one of these addresses is read by a
   * crawler or a bookmark, never posted to.
   */
  async redirects() {
    return legacyRedirects().map((redirect) => ({ ...redirect, statusCode: 301 as const }));
  },
  images: {
    /**
     * WebP (and AVIF) served automatically, with a JPEG/PNG fallback for
     * browsers that don't accept them.
     */
    formats: ["image/avif", "image/webp"],
    /** Widths of the `srcset` generated for full-width images. */
    deviceSizes: [640, 750, 828, 1024, 1440, 1920],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [{ loader: "@svgr/webpack", options: { icon: true } }],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
