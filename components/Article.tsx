import Image from "next/image";

import Heading from "@/components/Heading";
import { cn } from "@/utils/classnames";

interface ArticleProps {
  fullDisplay?: boolean;
  hLevel?: 1 | 2 | 3 | 4 | 5;
  link?: string;
  media: Array<{ url: string; alt: string }>;
  publication?: string;
  subtitle?: string;
  title: string;
}

const Article = ({ fullDisplay, hLevel = 1, link, media, publication, subtitle, title }: ArticleProps) => {
  return (
    <article>
      <div className="items-baseline gap-2 lg:flex">
        <Heading hLevel={hLevel}>{title}</Heading>
        {publication && (
          <span className="text-sm text-gray-500">
            <span className="hidden lg:inline">- </span>
            {publication}
          </span>
        )}
      </div>

      {subtitle && <p className="py-2">{subtitle}</p>}
      {link && (
        <p>
          <a href={link} className="text-sm text-sky-700 hover:underline" target="_blank" rel="noopener noreferrer">
            Retrouver l&apos;article sur le site du journal
          </a>
        </p>
      )}
      {media && media.length > 0 && (
        <div className={cn("relative mx-auto mt-4 w-full", { "lg:w-1/2": !fullDisplay })}>
          {media.map(({ url, alt }) => (
            <Image
              key={url}
              src={url}
              alt={alt}
              width="1024"
              height="500"
              sizes={fullDisplay ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
            />
          ))}
        </div>
      )}
    </article>
  );
};

export default Article;
