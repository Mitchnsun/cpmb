import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
