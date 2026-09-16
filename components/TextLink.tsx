import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/utils/classnames";

/**
 * The charter's text link: an underline drawn with `border-bottom` rather
 * than `text-decoration`, so it sits a little lower and keeps its colour.
 *
 * The tone says what the link sits on. `onLight` restates the teal/copper
 * pair of `globals.css` explicitly, so a link nested in a coloured block
 * never inherits that block's colour.
 */
export const textLinkVariants = cva("border-b border-current no-underline", {
  variants: {
    tone: {
      /** On the page background. */
      onLight: "text-teal hover:text-copper",
      /** On stage black. */
      onDark: "text-teal-light hover:text-copper-light",
    },
  },
  defaultVariants: { tone: "onLight" },
});

interface TextLinkProps
  extends
    PropsWithChildren,
    VariantProps<typeof textLinkVariants>,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "color"> {
  href: string;
}

/**
 * Anything that is not a route of this site — `mailto:`, `https://`, an
 * in-page `#anchor` — stays a plain anchor: `next/link` would route where
 * there is nothing to route to.
 */
const isRoute = (href: string) => href.startsWith("/");

const TextLink = ({ href, tone, className, children, ...htmlProps }: TextLinkProps) => {
  const classes = cn(textLinkVariants({ tone }), className);

  if (isRoute(href)) {
    return (
      <Link href={href} className={classes} {...htmlProps}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...htmlProps}>
      {children}
    </a>
  );
};

export default TextLink;
