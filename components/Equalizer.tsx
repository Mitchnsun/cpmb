import { cn } from "@/utils/classnames";

/**
 * Signature animée de l'en-tête (CPMB-02) : neuf barres qui « respirent ».
 * Durées de 2,1s à 3,2s et retards de 0 à 1,4s, tous différents d'une barre à
 * l'autre pour éviter l'effet de battement. Les barres 5 et 9 sont en cuivre.
 * Purement décoratif : hors de l'ordre de lecture des lecteurs d'écran, et
 * arrêté par la règle globale `prefers-reduced-motion`.
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
  /* Sous 260px — un écran de 390px zoomé à 200% — la signature n'a plus la
     place de tenir à côté du logo : elle s'efface plutôt que de déborder. */
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
