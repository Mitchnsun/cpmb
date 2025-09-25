import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ConcertPage, { generateMetadata, generateStaticParams } from "@/app/nos-concerts/[slug]/page";
import concerts from "@/assets/contents/concerts.json";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

describe("ConcertPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render concert when slug is found", async () => {
    const mockParams = { slug: concerts[0].slug };

    render(await ConcertPage({ params: mockParams }));

    expect(screen.getByRole("heading", { name: concerts[0].title })).toBeInTheDocument();
  });

  it("should call notFound when slug is not found", async () => {
    const mockParams = { slug: "non-existent-slug" };
    const { notFound } = await import("next/navigation");

    try {
      await ConcertPage({ params: mockParams });
    } catch {
      // notFound throws an error to stop execution
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("should generate static params for all concerts", async () => {
    const params = await generateStaticParams();

    expect(params).toHaveLength(concerts.length);
    expect(params[0]).toEqual({ slug: concerts[0].slug });
  });

  it("should generate metadata for existing concert", async () => {
    const mockParams = { slug: concerts[0].slug };

    const metadata = await generateMetadata({ params: mockParams });

    expect(metadata.title).toBe(`${concerts[0].title} | Chœur des Pays du Mont-Blanc`);
    expect(metadata.description).toBe(concerts[0].description);
  });

  it("should generate default metadata for non-existent concert", async () => {
    const mockParams = { slug: "non-existent-slug" };

    const metadata = await generateMetadata({ params: mockParams });

    expect(metadata.title).toBe("Concert non trouvé");
  });
});
