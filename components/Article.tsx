import Image from "next/image";

import TextLink from "@/components/TextLink";
import { cn } from "@/utils/classnames";

interface ArticleProps {
  fullDisplay?: boolean;
  hLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  link?: string;
  /** Each clipping carries its native dimensions, so its box is reserved before it loads. */
  media: Array<{ url: string; alt: string; width: number; height: number }>;
  publication?: string;
  subtitle?: string;
  /** Omitted when the page banner already carries the title. */
  title?: string;
}

/**
 * A press article: its title, the paper it came out in, and the clipping
 * itself. The title takes the charter's section size whatever heading level
 * the page gives it — the level is a matter of outline, not of scale.
 *
 * Clippings are scans of wildly different shapes, portrait as often as
 * landscape, so each one's own dimensions come from the data: a single
 * declared ratio would reserve the wrong box and shift the page once the
 * image lands.
 */
const Article = ({ fullDisplay, hLevel = 1, link, media, publication, subtitle, title }: ArticleProps) => {
  const Title = `h${hLevel}` as const;

  return (
    <article>
      {title ? (
        <div className="menu:flex items-baseline gap-3">
          <Title className="font-display text-3xl font-semibold">{title}</Title>
          {publication ? <span className="text-muted text-lg">{publication}</span> : null}
        </div>
      ) : null}

      {subtitle ? <p className={cn("max-w-prose text-lg", title && "mt-3")}>{subtitle}</p> : null}

      {link ? (
        <p className="mt-3">
          <TextLink href={link} target="_blank" rel="noopener noreferrer">
            Retrouver l&apos;article sur le site du journal
          </TextLink>
        </p>
      ) : null}

      {media.length > 0 ? (
        <div className={cn("mx-auto mt-6 w-full", { "menu:w-1/2": !fullDisplay })}>
          {media.map(({ url, alt, width, height }) => (
            <Image
              key={url}
              src={url}
              alt={alt}
              width={width}
              height={height}
              sizes={fullDisplay ? "100vw" : "(min-width: 700px) 50vw, 100vw"}
              className="border-border h-auto w-full rounded-sm border"
            />
          ))}
        </div>
      ) : null}
    </article>
  );
};

export default Article;
