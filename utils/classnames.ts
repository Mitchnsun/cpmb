import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `tailwind-merge` only knows the default scale: without this extension, it
 * would file our charter text sizes (`text-h2`, `text-body`…) under "text
 * colour" and drop them as soon as a colour is applied on the same element.
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
