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

  it("should render publication with proper formatting on desktop", () => {
    render(<Article title="Test Article" publication="Le Monde" media={mockMedia} />);

    const publication = screen.getByText("Le Monde");
    expect(publication).toBeInTheDocument();
    expect(publication.parentElement).toHaveTextContent("- Le Monde");
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

  it("should apply full display width styling when fullDisplay is true", () => {
    render(<Article title="Test Article" media={mockMedia} fullDisplay={true} />);

    const mediaContainer = screen.getAllByRole("img")[0].parentElement;
    expect(mediaContainer).not.toHaveClass("lg:w-1/2");
  });

  it("should apply limited width styling when fullDisplay is false or undefined", () => {
    const { rerender } = render(<Article title="Test Article" media={mockMedia} fullDisplay={false} />);

    let mediaContainer = screen.getAllByRole("img")[0].parentElement;
    expect(mediaContainer).toHaveClass("lg:w-1/2");

    rerender(<Article title="Test Article" media={mockMedia} />);
    mediaContainer = screen.getAllByRole("img")[0].parentElement;
    expect(mediaContainer).toHaveClass("lg:w-1/2");
  });

  it("should not render images section when media array is empty", () => {
    render(<Article title="Test Article" media={[]} />);

    const images = screen.queryAllByRole("img");
    expect(images).toHaveLength(0);
  });

  it("should not render publication when not provided", () => {
    render(<Article title="Test Article" media={mockMedia} />);

    expect(screen.queryByText(/- /)).not.toBeInTheDocument();
  });

  it("should not render subtitle when not provided", () => {
    render(<Article title="Test Article" media={mockMedia} />);

    const paragraphs = screen.queryAllByRole("paragraph");
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
