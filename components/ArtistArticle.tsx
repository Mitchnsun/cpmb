import Image from "next/image";

import Heading from "@/components/Heading";
import { cn } from "@/utils/classnames";

interface ArtistArticleProps {
  name: string;
  media: string;
  alt: string;
  text: string[];
  hLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const ArtistArticle = ({ name, media, alt, text, hLevel }: ArtistArticleProps) => {
  return (
    <article className="container mx-auto text-justify">
      <Heading hLevel={hLevel} className="mb-4">
        {name}
      </Heading>
      <div className="flex flex-col items-start gap-4 text-justify sm:flex-row lg:gap-8">
        <Image
          src={media}
          alt={alt}
          width={200}
          height={300}
          priority
          sizes="(min-width: 1024px) 15rem, 100vw"
          className="mx-auto h-80 w-full max-w-3xs grow-0 rounded-md object-cover lg:m-0 lg:h-auto"
        />
        <div>
          {text.map((paragraph, index) => (
            <p key={index} className={cn({ "mb-2": index < text.length - 1 })}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ArtistArticle;
