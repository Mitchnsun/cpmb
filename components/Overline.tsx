import { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/utils/classnames";

/**
 * Charter overline: mono, 12px, uppercase, wide tracking.
 * Colour is left to the caller — light copper on a dark background,
 * muted grey on the page background — and so is the tighter `0.14em`
 * tracking used by the footer columns and the partners banner.
 */
const Overline = ({ className, children, ...htmlProps }: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) => (
  <p className={cn("font-mono text-xs tracking-[0.16em] uppercase", className)} {...htmlProps}>
    {children}
  </p>
);

export default Overline;
