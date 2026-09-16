import Image from "next/image";

interface ArtistArticleProps {
  /** Omitted when the page banner already carries the name. */
  name?: string;
  media: string;
  /** Native dimensions of the portrait, so its box is reserved before it loads. */
  width: number;
  height: number;
  alt: string;
  text: string[];
  hLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Portrait of a performer: the photo beside the text.
 *
 * The layout wraps rather than reflows on a breakpoint — the portrait keeps
 * its own width and the text takes what is left, until the text no longer
 * fits beside it and drops below, the photo then centring itself. The page
 * owns the container and the gutter, not this component.
 *
 * Without a `name` no heading is rendered at all: on the artist page the
 * banner is already the `h1`, and merely hiding a second one would still
 * hand screen readers the same title twice.
 *
 * The portraits are not all the same shape — two of the three are square —
 * so each one's own dimensions come from the data: a single declared ratio
 * would reserve the wrong box and push the biography down on load.
 */
const ArtistArticle = ({ name, media, width, height, alt, text, hLevel = 2 }: ArtistArticleProps) => {
  const Title = `h${hLevel}` as const;

  return (
    <article>
      {name ? <Title className="font-display mb-5.5 text-3xl font-semibold">{name}</Title> : null}

      <div className="flex flex-wrap items-start gap-10">
        <Image
          src={media}
          alt={alt}
          width={width}
          height={height}
          sizes="256px"
          className="border-border mx-auto h-auto w-full max-w-3xs rounded-sm border object-cover"
        />
        {/* `min(…,100%)`, never a bare minimum: below ~336px the copy would
            otherwise stay wider than the gutter allows and spill out. */}
        <div className="grid min-w-[min(18rem,100%)] flex-1 gap-4">
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
