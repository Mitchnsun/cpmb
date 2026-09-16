import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/utils/classnames";

/**
 * The charter's call-to-action, as a link. One shape (48px tall, 8px radius,
 * semibold 18px), four tones depending on what it sits on: the global
 * `a`/`a:hover` colours of `globals.css` are overridden on every tone, hover
 * included, so the label never falls back to teal or copper.
 *
 * The variants are exported on their own for the rare action that cannot be
 * a `next/link`: a file download, which has to stay a plain `<a download>`.
 */
export const buttonLinkVariants = cva(
  "inline-flex min-h-12 items-center rounded-lg px-5.5 text-lg font-semibold no-underline transition-colors",
  {
    variants: {
      tone: {
        /** On the page background. */
        onLight: "bg-teal text-white hover:bg-teal-dark hover:text-white",
        /** On stage black. */
        onDark: "bg-teal-light text-stage-black hover:bg-copper-light hover:text-stage-black",
        /** On the teal "Nous rejoindre" banner. */
        onTeal: "bg-bg text-stage-black hover:bg-copper-light hover:text-stage-black",
        /** Secondary action, on the page background. */
        outline: "border-teal text-teal hover:bg-teal border hover:text-white",
      },
    },
    defaultVariants: { tone: "onLight" },
  }
);

interface ButtonLinkProps
  extends
    PropsWithChildren,
    VariantProps<typeof buttonLinkVariants>,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "color"> {
  href: string;
}

const ButtonLink = ({ href, tone, className, children, ...htmlProps }: ButtonLinkProps) => (
  <Link href={href} className={cn(buttonLinkVariants({ tone }), className)} {...htmlProps}>
    {children}
  </Link>
);

export default ButtonLink;
