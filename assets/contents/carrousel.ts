import { type SiteImage } from "@/assets/contents/medias";

/**
 * Photos of the gallery shown under the presentation.
 *
 * Adding one: drop the file in `public/carrousel/`, then append an entry
 * with its path, a written `alt` describing what the photo shows, and its
 * **native** dimensions — `__tests__/contents/carrousel.test.ts` reads each
 * file's own header and fails if a declared size drifts from the real one.
 *
 * Note on the current files: all of them except `CPMB2.jpg` were already
 * cropped to a 4.2:1 banner strip before they entered the repository, so
 * enlarging one shows that same strip at full resolution, not the original
 * frame. Replacing a file with its uncropped version is a file swap plus the
 * two dimensions here — no component changes.
 */
export const CARROUSEL_IMAGES: readonly SiteImage[] = [
  {
    src: "/carrousel/CPMB-2023.jpg",
    alt: "Le chœur et son orchestre en concert, 2023",
    width: 1920,
    height: 457,
  },
  {
    src: "/carrousel/CPMB-novembre-2023.jpg",
    alt: "Les choristes lisant leurs partitions, concert de novembre 2023",
    width: 1920,
    height: 457,
  },
  {
    src: "/carrousel/CPMB2.jpg",
    alt: "Le chœur en concert, écharpes turquoise, dirigé par Benoît Dubu",
    width: 2512,
    height: 1669,
  },
  {
    src: "/carrousel/Guillaume-Rault.jpg",
    alt: "Guillaume Rault dirigeant le chœur",
    width: 1920,
    height: 457,
  },
  {
    src: "/carrousel/Guillaume-novembre-2023.jpg",
    alt: "Guillaume Rault en concert, novembre 2023",
    width: 1920,
    height: 457,
  },
  {
    src: "/carrousel/Hautecombe-16.10.22.jpg",
    alt: "Concert à l'abbaye de Hautecombe, 16 octobre 2022",
    width: 1924,
    height: 457,
  },
] as const;
