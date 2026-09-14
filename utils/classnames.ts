import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `tailwind-merge` ne connaît que l'échelle par défaut : sans cette extension,
 * il rangerait nos tailles de texte de la charte (`text-h2`, `text-body`…)
 * dans le groupe « couleur de texte » et les supprimerait dès qu'une couleur
 * est appliquée sur le même élément.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1-hero", "h1", "h2", "h3", "h4", "body", "label", "legal", "overline"] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(...inputs));
};
