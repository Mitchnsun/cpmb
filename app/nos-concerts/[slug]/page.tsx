import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import concerts from "@/assets/contents/concerts.json";
import CalendarIcon from "@/assets/icons/calendar.svg";
import LocationIcon from "@/assets/icons/location.svg";
import Heading from "@/components/Heading";
import { formatFrenchDateTime } from "@/utils/formatDate";

interface ConcertPageProps {
  params: { slug: string };
}

type ConcertData = (typeof concerts)[number];

export default async function ConcertPage({ params }: ConcertPageProps) {
  const { slug } = params;

  const concert = concerts.find((c: ConcertData) => c.slug === slug);

  if (!concert) {
    notFound();
  }

  return (
    <div className="container mx-auto flex flex-col items-start px-4 py-8 lg:flex-row lg:gap-8">
      <div className="order-last mx-auto w-full shrink-0 lg:order-first lg:basis-2/5">
        <Image
          src={concert.media}
          alt={`Affiche: ${concert.title}`}
          width={1080}
          height={1500}
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
      </div>
      <section>
        <Heading hLevel={1}>{concert.title}</Heading>
        <div className="mt-2 flex flex-col lg:flex-row lg:gap-4">
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <CalendarIcon />
            {concert.date.map((d) => formatFrenchDateTime(d)).join(", ")}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <LocationIcon /> {concert.location}
          </p>
        </div>
        <p className="my-4">{concert.description}</p>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return concerts.map((c: ConcertData) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: ConcertPageProps): Promise<Metadata> {
  const { slug } = params;
  const concert = concerts.find((c: ConcertData) => c.slug === slug);

  if (!concert) {
    return { title: "Concert non trouvé" };
  }

  return {
    title: `${concert.title} | Chœur des Pays du Mont-Blanc`,
    description: concert.description,
  };
}
