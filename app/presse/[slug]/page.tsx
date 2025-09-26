import type { Metadata } from "next";
import { notFound } from "next/navigation";

import articles from "@/assets/contents/articles.json";
import Article from "@/components/Article";

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

  // Rechercher l'article correspondant au slug
  const article = articles.find((article: ArticleData) => article.slug === slug);

  // Si l'article n'est pas trouvé, rediriger vers la page 404
  if (!article) {
    notFound();
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <Article {...article} />
    </section>
  );
}

// Générer les paramètres statiques pour tous les articles
export function generateStaticParams() {
  return articles.map((article: ArticleData) => ({
    slug: article.slug,
  }));
}

// Générer les métadonnées pour le SEO
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((article: ArticleData) => article.slug === slug);

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
