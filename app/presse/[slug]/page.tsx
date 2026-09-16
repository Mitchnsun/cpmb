import type { Metadata } from "next";
import { notFound } from "next/navigation";

import articles from "@/assets/contents/articles.json";
import Article from "@/components/Article";
import PageBanner from "@/components/PageBanner";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

interface ArticleData {
  title: string;
  slug: string;
  publication?: string;
  subtitle?: string;
  media: Array<{ url: string; alt: string; type: string }>;
  link?: string;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = articles.find((item: ArticleData) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
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

  return {
    title: `${article.title} | Chœur des Pays du Mont-Blanc`,
    description: article.subtitle || article.title,
  };
}
