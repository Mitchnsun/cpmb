import Image from "next/image";

import { cn } from "@/utils/classnames";

interface ArtistArticleProps {
  name: string;
  media: string;
  alt: string;
  text: string[];
  hLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Kept in the outline but taken off screen, when a banner already shows it. */
  titleHidden?: boolean;
}

/**
 * Portrait of a performer: the photo beside the text.
 *
 * The layout wraps rather than reflows on a breakpoint — the portrait keeps
 * its own width and the text takes what is left, until the text no longer
 * fits beside it and drops below, the photo then centring itself. The page
 * owns the container and the gutter, not this component.
 */
const ArtistArticle = ({ name, media, alt, text, hLevel = 2, titleHidden }: ArtistArticleProps) => {
  const Title = `h${hLevel}` as const;

  return (
    <article>
      <Title className={cn("font-display mb-5.5 text-3xl font-semibold", titleHidden && "sr-only")}>{name}</Title>

      <div className="flex flex-wrap items-start gap-10">
        <Image
          src={media}
          alt={alt}
          width={200}
          height={300}
          sizes="256px"
          className="border-border mx-auto h-auto w-full max-w-3xs rounded-sm border object-cover"
        />
        <div className="grid min-w-2xs flex-1 gap-4">
          {text.map((paragraph) => (
            <p key={paragraph.slice(0, 50)} className="max-w-prose text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ArtistArticle;
