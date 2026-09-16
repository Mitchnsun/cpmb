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

/**
 * The arrows land on whatever the photo leaves them: on the picture itself
 * for a wide strip, on the page background for a tall one. The backing is
 * therefore opaque — translucent, it washed out to a grey blob over the
 * light letterbox — so the icon keeps its contrast either way.
 */
const controlClassName =
  "bg-stage-black text-text-on-dark hover:text-teal-light focus-visible:outline-teal-light absolute flex min-h-12 min-w-12 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Gallery of the choir's photos, shown under the presentation.
 *
 * Every slide is a button: clicking one opens it full size in a `Lightbox`.
 * Autoplay stops as soon as the visitor takes control — an arrow, a dot, a
 * photo, or simply tabbing in — so it never fights them. Under `prefers-reduced-motion` it never
 * runs at all, and the gallery says so: the live region turns polite and the
 * pause control disappears rather than offering to stop a standstill.
 *
 * No slide is `priority`: the home hero is the site's only one.
 */
const Carrousel = ({ autoplay = true }: CarrouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  /* Set after mount: reading the query at render would desync hydration. */
  const [reduceMotion, setReduceMotion] = useState(false);
  const [enlarged, setEnlarged] = useState<SiteImage | null>(null);
  /* The slide the lightbox was opened from, to focus again on close. */
  const openerRef = useRef<HTMLButtonElement>(null);
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
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* What the gallery is actually doing, which is what it must say it is
     doing: under `prefers-reduced-motion` nothing ever scrolls, so claiming
     to be playing would make the live region and the toggle lie. */
  const isScrolling = isPlaying && !reduceMotion;

  useEffect(() => {
    stopAutoplay();
    if (!isScrolling) return;

    /* Deferred, to keep the timer off the critical path. */
    startTimeoutRef.current = window.setTimeout(() => {
      startAutoplay();
      startTimeoutRef.current = null;
    }, 1500);

    return stopAutoplay;
  }, [isScrolling, startAutoplay, stopAutoplay]);

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
        role="region"
        aria-label="Photos du chœur"
        aria-roledescription="carrousel"
        aria-live={isScrolling ? "off" : "polite"}
        /* Tabbing in is enough to take control. Left running, the next tick
           would move the slide the visitor just reached, handing them a
           control that is now `aria-hidden` and out of the tab order while
           it still holds focus. Bubbles, so any control inside counts. */
        onFocus={() => setIsPlaying(false)}
      >
        {/* No frame at all: transparent and unruled, the photo sits straight
            on the page. A border drew a box around what a contained strip
            leaves empty, outlining the void rather than the picture. */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm">
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
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setIsPlaying(false);
                  setEnlarged(image);
                }}
                /* The button carries the description, so the image inside it
                   stays decorative: naming both would announce the photo
                   twice, once for the image and once for the control. */
                aria-label={`Agrandir la photo : ${image.alt}`}
                className="focus-visible:outline-teal-light relative h-full w-full flex-shrink-0 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4"
              >
                {/* `contain`, never `cover`: the point of the gallery is to
                    show the photo whole. Most files are already 4.2:1 strips,
                    and covering a 21/9 box would crop them again sideways. */}
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1200px) 1152px, 100vw"
                  className="object-contain"
                />
              </button>
            ))}
          </div>

          {/* Only the arrows sit on the photo, and only at its sides: a
              21/9 frame is barely 117px tall on a 320px screen, so anything
              in a corner would collide with them and steal their taps. */}
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
        </div>

        {/* Dots and pause live under the frame, on the page background:
            always legible, and never fighting the arrows for room. */}
        <div className="mt-2 flex flex-wrap items-center justify-center">
          <div className="flex">
            {images.map(({ src, alt }, index) => (
              <button
                key={src}
                type="button"
                onClick={takeOver(() => setCurrentIndex(index))}
                /* The charter's 44px target, around a 10px dot. Six of them
                   plus the pause overflow a 320px screen, so the row wraps
                   rather than shrinking any target below the rule. */
                className="focus-visible:outline-teal flex h-11 w-11 items-center justify-center focus-visible:outline-2"
                aria-label={`Photo ${index + 1} sur ${images.length} : ${alt}`}
                aria-current={index === currentIndex ? "true" : undefined}
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors",
                    index === currentIndex ? "bg-teal" : "bg-border"
                  )}
                />
              </button>
            ))}
          </div>

          {/* No control where there is nothing to control: under reduced
              motion the gallery never scrolls, so a toggle could only
              promise something it would not do. */}
          {reduceMotion ? null : (
            <button
              type="button"
              onClick={() => setIsPlaying((playing) => !playing)}
              className="text-muted hover:text-teal focus-visible:outline-teal ml-2 flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
              aria-label={isScrolling ? "Mettre le défilement en pause" : "Reprendre le défilement"}
              aria-pressed={isScrolling}
            >
              {isScrolling ? (
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
          )}
        </div>
      </div>

      <Lightbox image={enlarged} onClose={() => setEnlarged(null)} returnFocusTo={openerRef} />
    </>
  );
};

export default Carrousel;
