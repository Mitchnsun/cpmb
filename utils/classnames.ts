import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `tailwind-merge` only knows the default scale: without this extension, it
 * would file our charter's one custom text size (`text-h1`) under "text
 * colour" and drop it as soon as a colour is applied on the same element.
 * Every other charter size now overrides a native Tailwind size (see
 * app/globals.css) instead of introducing a new name, so it needs no entry
 * here.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1"] }],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(...inputs));
};
