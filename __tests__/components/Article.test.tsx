import { render, screen } from "@testing-library/react";

import Article from "@/components/Article";

describe("Article Component", () => {
  const mockMedia = [
    { url: "/test-image-1.jpg", alt: "Test image 1" },
    { url: "/test-image-2.jpg", alt: "Test image 2" },
  ];

  it("should render with minimal required props", () => {
    render(<Article title="Test Article" media={mockMedia} />);

    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Test Article");
  });

  it("should render with all props", () => {
    render(
      <Article
        title="Test Article"
        subtitle="Test subtitle"
        publication="Test Publication"
        link="https://example.com"
        media={mockMedia}
        hLevel={2}
        fullDisplay={true}
      />
    );

    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Test Article");

    expect(screen.getByText("Test subtitle")).toBeInTheDocument();
    expect(screen.getByText("Test Publication")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Retrouver l'article sur le site du journal" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should set the publication beside the title, in the muted tone", () => {
    render(<Article title="Test Article" publication="Le Monde" media={mockMedia} />);

    const publication = screen.getByText("Le Monde");
    expect(publication).toHaveClass("text-muted", "text-lg");
    expect(publication.parentElement).toHaveTextContent("Test ArticleLe Monde");
  });

  it("should render subtitle when provided", () => {
    render(<Article title="Test Article" subtitle="This is a subtitle" media={mockMedia} />);

    const subtitle = screen.getByText("This is a subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.tagName).toBe("P");
  });

  it("should render external link when provided", () => {
    render(<Article title="Test Article" link="https://journal.com/article" media={mockMedia} />);

    const link = screen.getByRole("link", { name: "Retrouver l'article sur le site du journal" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://journal.com/article");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render all provided images", () => {
    render(<Article title="Test Article" media={mockMedia} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);

    expect(images[0]).toHaveAttribute("src", "/test-image-1.jpg");
    expect(images[0]).toHaveAttribute("alt", "Test image 1");
    expect(images[1]).toHaveAttribute("src", "/test-image-2.jpg");
    expect(images[1]).toHaveAttribute("alt", "Test image 2");
  });

  it("should apply correct heading level", () => {
    const { rerender } = render(<Article title="Test Article" hLevel={3} media={mockMedia} />);

    let heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();

    rerender(<Article title="Test Article" hLevel={5} media={mockMedia} />);
    heading = screen.getByRole("heading", { level: 5 });
    expect(heading).toBeInTheDocument();
  });

  it("should let the clipping run full width when fullDisplay is set", () => {
    render(<Article title="Test Article" media={mockMedia} fullDisplay={true} />);

    const mediaContainer = screen.getAllByRole("img")[0].parentElement;
    expect(mediaContainer).not.toHaveClass("menu:w-1/2");
  });

  it("should hold the clipping to half the width below fullDisplay", () => {
    const { rerender } = render(<Article title="Test Article" media={mockMedia} fullDisplay={false} />);

    let mediaContainer = screen.getAllByRole("img")[0].parentElement;
    expect(mediaContainer).toHaveClass("menu:w-1/2");

    rerender(<Article title="Test Article" media={mockMedia} />);
    mediaContainer = screen.getAllByRole("img")[0].parentElement;
    expect(mediaContainer).toHaveClass("menu:w-1/2");
  });

  it("should not render images section when media array is empty", () => {
    render(<Article title="Test Article" media={[]} />);

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);
  });

  it("should not render publication when not provided", () => {
    render(<Article title="Test Article" media={mockMedia} />);

    expect(screen.getByRole("heading").parentElement).toHaveTextContent("Test Article");
  });

  it("should drop the whole title block when the page banner already carries it", () => {
    render(<Article subtitle="Le chapô de l'article" publication="Le Monde" media={mockMedia} />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText("Le Monde")).not.toBeInTheDocument();
    expect(screen.getByText("Le chapô de l'article")).toBeInTheDocument();
  });

  it("should give the charter's section size to the title, whatever its level", () => {
    render(<Article title="Test Article" media={mockMedia} hLevel={4} />);

    expect(screen.getByRole("heading", { level: 4 })).toHaveClass("font-display", "text-3xl", "font-semibold");
  });

  it("should not render subtitle when not provided", () => {
    const { container } = render(<Article title="Test Article" media={mockMedia} />);

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("should not render link when not provided", () => {
    render(<Article title="Test Article" media={mockMedia} />);

    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });

  it("should have correct image attributes for Next.js optimization", () => {
    render(<Article title="Test Article" media={mockMedia} />);

    const images = screen.getAllByRole("img");
    images.forEach((image) => {
      expect(image).toHaveAttribute("width", "1024");
      expect(image).toHaveAttribute("height", "500");
    });
  });
});
