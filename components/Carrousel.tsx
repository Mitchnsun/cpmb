"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { CARROUSEL_IMAGES as images } from "@/assets/contents/carrousel";

interface CarrouselProps {
  autoplay?: boolean;
}

const Carrousel = ({ autoplay = true }: CarrouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const intervalRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsPlaying(autoplay);
  }, [autoplay]);

  // Start the autoplay interval
  const startAutoplay = useCallback(() => {
    if (intervalRef.current !== null) return; // already running
    intervalRef.current = window.setInterval(nextSlide, 6000);
  }, [nextSlide]);

  // Clear all timers (interval + idle + timeout)
  const stopAutoplay = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Clear a pending timeout fallback if any
    if (startTimeoutRef.current !== null) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
  }, []);

  // Idle-ish autoplay scheduling (defer start slightly off the critical path)
  useEffect(() => {
    // Respect reduced motion preferences and current play state
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Always clear existing timers when dependencies change
    stopAutoplay();
    if (!isPlaying || reduce) return;

    // Defer a bit to keep it off the critical path
    startTimeoutRef.current = window.setTimeout(() => {
      startAutoplay();
      startTimeoutRef.current = null;
    }, 1500);

    return () => {
      stopAutoplay();
    };
  }, [isPlaying, startAutoplay, stopAutoplay]);

  // Ensure we mirror prop changes for autoplay toggling
  useEffect(() => {
    setIsPlaying(autoplay);
  }, [autoplay]);

  return (
    <section
      className="relative h-48 w-full overflow-hidden rounded-lg shadow-lg lg:h-96"
      aria-label="Carrousel d'images du chœur"
      role="region"
      aria-roledescription="carousel"
      aria-live={isPlaying ? "off" : "polite"}
    >
      {/* Images container */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out motion-reduce:transition-none motion-reduce:duration-0"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={image.src} className="relative h-full w-full flex-shrink-0" aria-hidden={index !== currentIndex}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1536px) 1536px, (min-width: 1280px) 1280px, (min-width: 1024px) 1024px, (min-width: 768px) 768px, (min-width: 640px) 640px, 100vw"
              className="object-cover"
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "low"}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        type="button"
        onClick={() => {
          setIsPlaying(false);
          prevSlide();
        }}
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 focus:outline-none"
        aria-label="Image précédente"
      >
        <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => {
          setIsPlaying(false);
          nextSlide();
        }}
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 focus:outline-none"
        aria-label="Image suivante"
      >
        <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Play/Pause button */}
      <button
        type="button"
        onClick={togglePlayPause}
        className="absolute right-4 bottom-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 focus:outline-none"
        aria-label={isPlaying ? "Mettre en pause" : "Reprendre"}
        aria-pressed={isPlaying}
      >
        {isPlaying ? (
          <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
          </svg>
        ) : (
          <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map(({ src }, index) => (
          <button
            key={src}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 focus:outline-none ${
              index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
            aria-current={index === currentIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default Carrousel;
