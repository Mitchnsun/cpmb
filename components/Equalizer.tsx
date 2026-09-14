import { cn } from "@/utils/classnames";

/**
 * Header's animated signature: nine bars that "breathe".
 * Durations from 2.1s to 3.2s and delays from 0 to 1.4s, each different to
 * avoid a beating effect. Bars 5 and 9 are copper. Purely decorative: out of
 * screen readers' reading order, and stopped by the global
 * `prefers-reduced-motion` rule.
 */
const BARS = [
  { duration: "2.6s", delay: "0s", accent: false },
  { duration: "2.2s", delay: "0.3s", accent: false },
  { duration: "3s", delay: "0.6s", accent: false },
  { duration: "2.4s", delay: "0.9s", accent: false },
  { duration: "2.8s", delay: "1.2s", accent: true },
  { duration: "2.1s", delay: "0.5s", accent: false },
  { duration: "3.2s", delay: "0.8s", accent: false },
  { duration: "2.5s", delay: "1.4s", accent: false },
  { duration: "2.3s", delay: "0.2s", accent: true },
] as const;

const Equalizer = () => (
  /* Below 260px — a 390px screen zoomed to 200% — the signature no longer
     fits next to the logo, so it hides instead of overflowing. */
  <span aria-hidden="true" className="flex h-5 items-end gap-0.5 max-[260px]:hidden">
    {BARS.map(({ duration, delay, accent }) => (
      <span
        key={`${duration}-${delay}`}
        className={cn("animate-breathe h-full w-[3px] origin-bottom", accent ? "bg-copper" : "bg-teal")}
        style={{ animationDuration: duration, animationDelay: delay }}
      />
    ))}
  </span>
);

export default Equalizer;
