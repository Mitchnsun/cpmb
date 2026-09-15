import Image from "next/image";

import { PARTNER_LOGOS } from "@/assets/contents/medias";
import Overline from "@/components/Overline";

/**
 * Partners banner (CPMB-10). Cartouches are the cells of a `gap-px` grid, so
 * they share the same height at every width and the rules are the gaps.
 *
 * Each logo is bounded in height only — never in width — by the `maxHeight`
 * declared in the media library: three different proportions, optically
 * levelled, with no distortion.
 */
const PartnersBanner = () => (
  <section className="max-w-site mx-auto px-6 py-16" aria-labelledby="partenaires">
    <Overline id="partenaires" className="text-muted mb-7 tracking-[0.14em]">
      Partenaires
    </Overline>
    <div className="bg-border grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-px">
      {PARTNER_LOGOS.map(({ name, href, src, alt, width, height, sizes, maxHeight }) => (
        <a key={name} href={href} className="bg-surface flex min-h-30 items-center justify-center p-6">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            style={{ maxHeight }}
            className="h-auto w-auto max-w-full object-contain"
          />
        </a>
      ))}
    </div>
  </section>
);

export default PartnersBanner;
