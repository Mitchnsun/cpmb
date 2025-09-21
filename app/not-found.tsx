import Image from "next/image";
import Link from "next/link";

import Heading from "@/components/Heading";

export default function NotFound() {
  return (
    <main>
      <section className="relative mx-auto mb-4 h-80 w-full md:h-96 lg:mb-8 xl:h-128">
        <Image
          src="/media/illustration_404.jpeg"
          alt="Illustration d'une montagne dans le pays du Mont-Blanc"
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
        <Heading
          hLevel={1}
          variant={0}
          className="absolute bottom-8 w-full text-center text-5xl text-white text-shadow-sm md:text-6xl lg:text-7xl"
        >
          Page non trouvée
        </Heading>
      </section>
      <section className="container mx-auto mb-6 p-4 text-center">
        <p className="mb-8 text-gray-600">Désolé, la page que vous recherchez n&apos;existe pas.</p>
        <Link href="/" className="inline-block rounded bg-sky-600 px-6 py-3 text-white hover:bg-sky-700">
          Retour à l&apos;accueil
        </Link>
      </section>
    </main>
  );
}
