import Image from "next/image";
import Link from "next/link";

import CalendarIcon from "@/assets/icons/calendar.svg";
import LocationIcon from "@/assets/icons/location.svg";
import { formatFrenchDateTime } from "@/utils/formatDate";
import { truncateAtWord } from "@/utils/truncate";

import Heading from "./Heading";

interface ConcertProps {
  title: string;
  slug: string;
  date: string[];
  description: string;
  location: string;
  media: string;
}
const Concert = ({ title, slug, date, description, location, media }: ConcertProps) => {
  return (
    <div className="grid grid-cols-2 items-start gap-2 overflow-hidden rounded-md bg-white shadow-md md:grid-cols-[150px_1fr]">
      <Image
        src={media}
        alt={`Affiche: ${title}`}
        height={250}
        width={150}
        className="row-start-1 h-auto w-full md:row-span-2"
      />
      <div className="p-2">
        <Heading hLevel={3} variant={2}>
          {title}
        </Heading>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <CalendarIcon />
          {date.map((d) => formatFrenchDateTime(d)).join(", ")}
        </p>
        <p className="flex items-center gap-1 text-sm text-gray-500">
          <LocationIcon /> {location}
        </p>
      </div>
      <p className="col-span-2 p-2 pt-0 text-sm text-gray-800 md:col-start-2 md:row-start-2">
        {truncateAtWord(description, 150)}
        <Link
          href={`/nos-concerts/${slug}`}
          className="ml-1 inline-block text-sm text-sky-700 underline-offset-2 hover:underline"
        >
          En savoir plus
        </Link>
      </p>
    </div>
  );
};

export default Concert;
