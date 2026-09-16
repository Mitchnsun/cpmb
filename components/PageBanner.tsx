import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { type SiteImage } from "@/assets/contents/medias";
import Overline from "@/components/Overline";
import { cn } from "@/utils/classnames";

/** Decorative ridge drawn across a banner carrying a photo. */
const RIDGE_POINTS = "0,170 200,120 340,150 520,90 700,140 900,80 1100,130 1280,100 1440,150";

interface PageBannerProps {
  /** Mono overline above the title. */
  overline: string;
  /** Page title, rendered as the `h1`. */
  title: ReactNode;
  /** Background photo. Without one the banner is plain stage black. */
  image?: SiteImage;
  /** Back link shown above the overline (concert pages). */
  backLink?: { href: string; label: string };
}

/**
 * Inner-page banner (epic #17, "Bandeau de page intérieure"): stage black,
 * an optional photo darkened from left to right, the mono overline and the
 * page title.
 *
 * Nothing here is animated — the ridge is drawn, not traced: the charter
 * reserves the animated staff for the home hero.
 */
const PageBanner = ({ overline, title, image, backLink }: PageBannerProps) => (
  <section className="bg-stage-black relative overflow-hidden">
    {image ? (
      <>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={image.sizes}
          style={{ objectPosition: image.objectPosition }}
          className="object-cover"
        />
        {/* Darkened where the text sits: contrast is measured on the gradient. */}
        <div
          aria-hidden="true"
          className="from-stage-black/94 via-stage-black/80 to-stage-black/62 absolute inset-0 bg-linear-90 via-60%"
        />
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <polyline points={RIDGE_POINTS} fill="none" className="stroke-stage-border stroke-2" />
        </svg>
      </>
    ) : null}

    <div className={cn("max-w-site relative mx-auto px-6 pb-14", image ? "pt-16" : "pt-10")}>
      {backLink ? (
        <Link
          href={backLink.href}
          className="text-teal-light hover:text-copper-light mb-7 inline-block border-b border-current text-lg no-underline"
        >
          {backLink.label}
        </Link>
      ) : null}
      <Overline className="text-copper-light mb-3.5">{overline}</Overline>
      <h1 className="font-display text-h1 font-semibold text-white">{title}</h1>
    </div>
  </section>
);

export default PageBanner;
