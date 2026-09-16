import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { AnchorHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/utils/classnames";

/**
 * A 44px-tall touch target, centred on the link and reaching past it.
 *
 * The charter asks for 44px, and a line of 18px text is 26. Growing the box
 * itself would drag the `border-bottom` underline away from the text, so the
 * target is an overlay instead: the link keeps its size, its rhythm and its
 * underline, and the finger gets the height. A list of such links needs a
 * gap of at least 16px, or neighbouring targets overlap and a tap near the
 * edge reaches the wrong one.
 *
 * Only for a link standing on its own. A link inside a sentence is exempt
 * (WCAG 2.2, 2.5.8) and an overlay there would cover the text above it.
 */
export const TOUCH_TARGET =
  "relative after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']";

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
    /** `true` for a link on a line of its own: see `TOUCH_TARGET`. */
    touch: { true: TOUCH_TARGET, false: "" },
  },
  defaultVariants: { tone: "onLight", touch: false },
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

const TextLink = ({ href, tone, touch, className, children, ...htmlProps }: TextLinkProps) => {
  const classes = cn(textLinkVariants({ tone, touch }), className);

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
