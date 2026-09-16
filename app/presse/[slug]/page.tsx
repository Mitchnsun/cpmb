import type { Metadata } from "next";
import { notFound } from "next/navigation";

import articles from "@/assets/contents/articles.json";
import { HOME_LINK, NAV_LINKS } from "@/assets/contents/navigation";
import Article from "@/components/Article";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { pageMetadata } from "@/utils/metadata";
import { articlePath } from "@/utils/site";
import { breadcrumb, pressArticle } from "@/utils/structuredData";

/** "Presse" as `navigation.ts` names it, reused rather than retyped. */
const PRESSE_LINK = NAV_LINKS.find((link) => link.href === "/presse")!;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

/** Derived from the JSON, so widening the data widens the type. */
type ArticleData = (typeof articles)[number];

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = articles.find((item: ArticleData) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* A press clipping, dated and attributed (CPMB-18). */}
      <JsonLd data={pressArticle(article)} />
      <JsonLd
        data={breadcrumb([
          { name: HOME_LINK.label, path: HOME_LINK.href },
          { name: PRESSE_LINK.label, path: PRESSE_LINK.href },
          { name: article.title, path: articlePath(article.slug) },
        ])}
      />

      <PageBanner
        backLink={{ href: "/presse", label: "Retour à la revue de presse" }}
        overline={article.publication ?? "Revue de presse"}
        title={article.title}
      />

      <section className="max-w-site mx-auto px-6 pt-14 pb-20">
        {/* The banner already carries the title and the paper: the article
            component renders the clipping alone. */}
        <Article subtitle={article.subtitle} link={article.link} media={article.media} fullDisplay />
      </section>
    </>
  );
}

export function generateStaticParams() {
  return articles.map((article: ArticleData) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item: ArticleData) => item.slug === slug);

  if (!article) {
    return {
      title: "Article non trouvé",
    };
  }

  const [clipping] = article.media;

  return pageMetadata({
    title: article.title,
    description: article.subtitle || article.title,
    path: `/presse/${article.slug}`,
    /* The scan of the clipping itself, when the article carries one. */
    ...(clipping
      ? { image: { src: clipping.url, alt: clipping.alt, width: clipping.width, height: clipping.height } }
      : {}),
    type: "article",
  });
}
