import articles from "@/assets/contents/articles.json";
import Article from "@/components/Article";
import PageBanner from "@/components/PageBanner";
import TextLink from "@/components/TextLink";
import { pageMetadata } from "@/utils/metadata";

export const metadata = pageMetadata({
  title: "Presse",
  description:
    "La revue de presse du Chœur des Pays du Mont-Blanc : les articles parus dans le Dauphiné Libéré et la presse locale à propos de nos concerts.",
  path: "/presse",
  keywords: ["chœur", "mont-blanc", "presse", "articles", "concerts", "actualités", "médias"],
});

export default function Presse() {
  const [latest, ...rest] = articles;

  return (
    <>
      <PageBanner overline="Revue de presse" title="Presse" />

      <section className="max-w-site mx-auto px-6 pt-16 pb-20">
        <Article hLevel={2} {...latest} />

        <h2 className="font-display border-teal mt-12 mb-6 border-b-2 pb-3 text-3xl font-semibold">Autres articles</h2>
        <ul className="grid gap-3">
          {rest.map((article) => (
            <li key={article.slug} className="text-lg">
              <TextLink href={`/presse/${article.slug}`}>{article.title}</TextLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
