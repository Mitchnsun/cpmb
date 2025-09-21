import type { Metadata } from "next";
import Link from "next/link";

import articles from "@/assets/contents/articles.json";
import Article from "@/components/Article";
import Heading from "@/components/Heading";

export const metadata: Metadata = {
  title: "Presse - Chœur des Pays du Mont-Blanc",
  description:
    "Retrouvez tous les articles de presse sur le Chœur des Pays du Mont-Blanc. Découvrez nos dernières actualités et nos concerts dans les médias locaux.",
  keywords: "chœur, mont-blanc, presse, articles, concerts, actualités, médias",
};

export default function Presse() {
  const lastArticles = articles[0];
  const rest = articles.slice(1);

  return (
    <section className="container mx-auto mt-2 p-4">
      <Heading hLevel={1} variant={0} className="mb-8 border-b-2 border-sky-700 pb-2 text-2xl lg:w-1/2">
        Presse
      </Heading>
      <Article hLevel={2} {...lastArticles} />
      <Heading hLevel={3} variant={2} className="mt-12 mb-4 border-b-2 border-sky-700 pb-1 lg:w-1/2">
        Autres articles
      </Heading>
      {rest.map((article) => (
        <Link key={article.title} href={`/presse/${article.slug}`} className="mb-2 block text-sky-700 hover:underline">
          {article.title}
        </Link>
      ))}
    </section>
  );
}
