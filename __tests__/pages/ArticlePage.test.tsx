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

    expect(screen.getByRole("heading", { name: articles[0].title })).toBeInTheDocument();
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

    expect(metadata.title).toBe(`${articles[0].title} | Chœur des Pays du Mont-Blanc`);
    expect(metadata.description).toBe(articles[0].subtitle);
  });

  it("should generate default metadata for non-existent article", async () => {
    const mockParams = Promise.resolve({ slug: "non-existent-slug" });

    const metadata = await generateMetadata({ params: mockParams });

    expect(metadata.title).toBe("Article non trouvé");
  });
});
