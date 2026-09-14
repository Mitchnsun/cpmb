import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * CPMB-05 — WebP (et AVIF) servis automatiquement, avec repli JPEG/PNG
     * pour les navigateurs qui ne les acceptent pas.
     */
    formats: ["image/avif", "image/webp"],
    /** Largeurs du `srcset` généré pour les images pleine largeur. */
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
