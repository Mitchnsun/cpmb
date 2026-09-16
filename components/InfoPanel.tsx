import { type HTMLAttributes, type PropsWithChildren, type Ref } from "react";

import { cn } from "@/utils/classnames";

interface InfoPanelProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  /** Teal for neutral information, copper for the past and the archive. */
  accent?: "teal" | "copper";
  /** React 19 passes `ref` as a plain prop; the contact confirmation focuses it. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * The charter's information panel: a white card on the page background,
 * marked on its left edge by the accent that says what it holds.
 */
const InfoPanel = ({ accent = "teal", className, children, ...htmlProps }: InfoPanelProps) => (
  <div
    className={cn(
      "bg-surface border-border rounded-sm border border-l-[3px] p-6",
      accent === "copper" ? "border-l-copper" : "border-l-teal",
      className
    )}
    {...htmlProps}
  >
    {children}
  </div>
);

export default InfoPanel;
