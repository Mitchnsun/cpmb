"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { CARROUSEL_IMAGES as images } from "@/assets/contents/carrousel";
import { type SiteImage } from "@/assets/contents/medias";
import ChevronIcon from "@/assets/icons/chevron-down.svg";
import Lightbox from "@/components/Lightbox";
import { cn } from "@/utils/classnames";

interface CarrouselProps {
  autoplay?: boolean;
}

/** Controls sit over the photo, so they carry their own dark backing. */
const controlClassName =
  "bg-stage-black/60 text-text-on-dark hover:bg-stage-black hover:text-teal-light focus-visible:outline-teal-light absolute flex min-h-12 min-w-12 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Gallery of the choir's photos, shown under the presentation.
 *
 * Every slide is a button: clicking one opens it full size in a `Lightbox`.
 * Autoplay stops as soon as the visitor takes control — an arrow, a dot or a
 * photo — so it never fights them, and it never starts at all under
 * `prefers-reduced-motion`.
 *
 * No slide is `priority`: the home hero is the site's only one.
 */
const Carrousel = ({ autoplay = true }: CarrouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [enlarged, setEnlarged] = useState<SiteImage | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((previous) => (previous + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((previous) => (previous - 1 + images.length) % images.length);
  }, []);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(nextSlide, 6000);
  }, [nextSlide]);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startTimeoutRef.current !== null) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    stopAutoplay();
    if (!isPlaying || reduce) return;

    /* Deferred, to keep the timer off the critical path. */
    startTimeoutRef.current = window.setTimeout(() => {
      startAutoplay();
      startTimeoutRef.current = null;
    }, 1500);

    return stopAutoplay;
  }, [isPlaying, startAutoplay, stopAutoplay]);

  // Mirror prop changes for autoplay toggling. Adjusting state during render
  // rather than in an effect avoids a cascading re-render, per
  // https://react.dev/learn/you-might-not-need-an-effect
  const [previousAutoplay, setPreviousAutoplay] = useState(autoplay);
  if (previousAutoplay !== autoplay) {
    setPreviousAutoplay(autoplay);
    setIsPlaying(autoplay);
  }

  /* Any deliberate move hands control over: the slideshow stops running. */
  const takeOver = (move: () => void) => () => {
    setIsPlaying(false);
    move();
  };

  return (
    <>
      <div
        className="border-border bg-stage-black relative aspect-[21/9] w-full overflow-hidden rounded-sm border"
        aria-label="Photos du chœur"
        role="region"
        aria-roledescription="carrousel"
        aria-live={isPlaying ? "off" : "polite"}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              // Only the slide on screen is reachable, by pointer or by tab.
              aria-hidden={index !== currentIndex}
              tabIndex={index === currentIndex ? undefined : -1}
              onClick={takeOver(() => setEnlarged(image))}
              /* The button carries the description, so the image inside it
                 stays decorative: naming both would announce the photo
                 twice, once for the image and once for the control. */
              aria-label={`Agrandir la photo : ${image.alt}`}
              className="focus-visible:outline-teal-light relative h-full w-full flex-shrink-0 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4"
            >
              {/* `contain`, never `cover`: the point of the gallery is to
                  show the photo whole. Most files are already 4.2:1 strips,
                  and covering a 21/9 box would crop them again sideways. */}
              <Image src={image.src} alt="" fill sizes="(min-width: 1200px) 1152px, 100vw" className="object-contain" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={takeOver(prevSlide)}
          className={cn(controlClassName, "top-1/2 left-4 -translate-y-1/2")}
          aria-label="Photo précédente"
        >
          <ChevronIcon aria-hidden="true" className="h-6 w-6 rotate-90" />
        </button>

        <button
          type="button"
          onClick={takeOver(nextSlide)}
          className={cn(controlClassName, "top-1/2 right-4 -translate-y-1/2")}
          aria-label="Photo suivante"
        >
          <ChevronIcon aria-hidden="true" className="h-6 w-6 -rotate-90" />
        </button>

        <button
          type="button"
          onClick={() => setIsPlaying((playing) => !playing)}
          className={cn(controlClassName, "right-4 bottom-4")}
          aria-label={isPlaying ? "Mettre le défilement en pause" : "Reprendre le défilement"}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <rect x="7" y="6" width="3.5" height="12" rx="1" />
              <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Same dark backing as the other controls: a tall photo fills the
            box and the dots would otherwise sit on the picture itself. */}
        <div className="bg-stage-black/60 absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-lg px-3">
          {images.map(({ src, alt }, index) => (
            <button
              key={src}
              type="button"
              onClick={takeOver(() => setCurrentIndex(index))}
              /* 44px touch target around a 12px dot. */
              className="focus-visible:outline-teal-light flex h-11 w-5 items-center justify-center focus-visible:outline-2"
              aria-label={`Photo ${index + 1} sur ${images.length} : ${alt}`}
              aria-current={index === currentIndex ? "true" : undefined}
            >
              <span
                className={cn(
                  "h-3 w-3 rounded-full transition-colors",
                  index === currentIndex ? "bg-teal-light" : "bg-text-on-dark/50"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Lightbox image={enlarged} onClose={() => setEnlarged(null)} />
    </>
  );
};

export default Carrousel;
