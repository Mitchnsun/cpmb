import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ArticlePage, { generateMetadata, generateStaticParams } from "@/app/presse/[slug]/page";
import articles from "@/assets/contents/articles.json";

describe("ArticlePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render article when slug is found", async () => {
    const mockParams = Promise.resolve({ slug: articles[0].slug });

    render(await ArticlePage({ params: mockParams }));

    expect(screen.getByRole("heading", { level: 1, name: articles[0].title })).toBeInTheDocument();
  });

  it("should carry the title once, on the banner, and not again above the clipping", async () => {
    const mockParams = Promise.resolve({ slug: articles[0].slug });

    render(await ArticlePage({ params: mockParams }));

    expect(screen.getAllByRole("heading", { name: articles[0].title })).toHaveLength(1);
  });

  it("should offer a way back to the press page", async () => {
    const mockParams = Promise.resolve({ slug: articles[0].slug });

    render(await ArticlePage({ params: mockParams }));

    expect(screen.getByRole("link", { name: "Retour à la revue de presse" })).toHaveAttribute("href", "/presse");
  });

  it("should call notFound when slug is not found", async () => {
    const mockParams = Promise.resolve({ slug: "non-existent-slug" });
    const { notFound } = await import("next/navigation");

    try {
      await ArticlePage({ params: mockParams });
    } catch {
      // notFound throws an error to stop execution
    }

    expect(notFound).toHaveBeenCalled();
  });
  it("should generate static params for all articles", async () => {
    const params = await generateStaticParams();

    expect(params).toHaveLength(articles.length);
    expect(params[0]).toEqual({ slug: articles[0].slug });
  });

  it("should generate metadata for existing article", async () => {
    const mockParams = Promise.resolve({ slug: articles[0].slug });

    const metadata = await generateMetadata({ params: mockParams });

    /* The choir's name is appended by the layout's title template. */
    expect(metadata.title).toBe(articles[0].title);
    expect(metadata.description).toBe(articles[0].subtitle);
    expect(metadata.alternates?.canonical).toBe(`/presse/${articles[0].slug}`);
  });

  it("should share the clipping itself as the social card", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: articles[0].slug }) });

    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: articles[0].media[0].url, alt: articles[0].media[0].alt }),
    ]);
  });

  it("should generate default metadata for non-existent article", async () => {
    const mockParams = Promise.resolve({ slug: "non-existent-slug" });

    const metadata = await generateMetadata({ params: mockParams });

    expect(metadata.title).toBe("Article non trouvé");
  });

  it("should describe itself as a dated, attributed NewsArticle", async () => {
    const dated = articles.find((article) => /^\d{4}-\d{2}-\d{2}$/.test(article.date))!;
    const { container } = render(await ArticlePage({ params: Promise.resolve({ slug: dated.slug }) }));

    const blocks = [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
      JSON.parse(node.textContent ?? "{}")
    );
    const article = blocks.find((block) => block["@type"] === "NewsArticle");

    expect(article).toMatchObject({
      headline: dated.title,
      datePublished: dated.date,
      url: `https://choeurdespaysdumontblanc.fr/presse/${dated.slug}`,
    });
  });

  it("should leave datePublished out when the paper gives only the month", async () => {
    const monthOnly = articles.find((article) => /^\d{4}-\d{2}$/.test(article.date))!;
    const { container } = render(await ArticlePage({ params: Promise.resolve({ slug: monthOnly.slug }) }));

    const blocks = [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
      JSON.parse(node.textContent ?? "{}")
    );
    const article = blocks.find((block) => block["@type"] === "NewsArticle");

    expect(article.datePublished).toBeUndefined();
  });

  it("should trail the article with a breadcrumb from the home page", async () => {
    const { container } = render(await ArticlePage({ params: Promise.resolve({ slug: articles[0].slug }) }));

    const blocks = [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
      JSON.parse(node.textContent ?? "{}")
    );
    const trail = blocks.find((block) => block["@type"] === "BreadcrumbList");

    expect(trail.itemListElement.map((item: { name: string }) => item.name)).toEqual([
      "Accueil",
      "Presse",
      articles[0].title,
    ]);
  });
});
