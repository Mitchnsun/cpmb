import { render, screen } from "@testing-library/react";

import ArtistArticle from "@/components/ArtistArticle";

describe("ArtistArticle", () => {
  const mockProps = {
    name: "John Doe",
    media: "/test-image.jpg",
    alt: "Portrait de John Doe",
    text: [
      "Premier paragraphe de présentation de l'artiste.",
      "Deuxième paragraphe avec plus de détails.",
      "Troisième paragraphe de conclusion.",
    ],
  };

  it("should render the artist article with all elements", () => {
    render(<ArtistArticle {...mockProps} />);

    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    // The page owns the container and the gutter, not this component.
    expect(article.className).toBe("");

    const heading = screen.getByRole("heading", { name: mockProps.name });
    expect(heading).toBeInTheDocument();

    const image = screen.getByRole("img", { name: mockProps.alt });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockProps.media);
    expect(image).toHaveAttribute("alt", mockProps.alt);
    expect(image).toHaveAttribute("width", "200");
    expect(image).toHaveAttribute("height", "300");

    mockProps.text.forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  it("should render with custom heading level", () => {
    render(<ArtistArticle {...mockProps} hLevel={3} />);

    const heading = screen.getByRole("heading", { name: mockProps.name, level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H3");
  });

  it("should space the paragraphs with the grid gap, not a margin on each", () => {
    render(<ArtistArticle {...mockProps} />);

    const paragraphs = screen.getAllByText(/paragraphe/);
    paragraphs.forEach((paragraph) => {
      expect(paragraph).toHaveClass("max-w-prose", "text-lg");
    });
    expect(paragraphs[0].parentElement).toHaveClass("grid", "gap-4");
  });

  it("should render with single paragraph", () => {
    const singleParagraphProps = {
      ...mockProps,
      text: ["Un seul paragraphe de texte."],
    };

    render(<ArtistArticle {...singleParagraphProps} />);

    const paragraph = screen.getByText("Un seul paragraphe de texte.");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass("text-lg");
  });

  it("should render with empty text array", () => {
    const emptyTextProps = {
      ...mockProps,
      text: [],
    };

    render(<ArtistArticle {...emptyTextProps} />);

    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: mockProps.name })).toBeInTheDocument();
  });

  it("should give the portrait the charter's image frame", () => {
    render(<ArtistArticle {...mockProps} />);

    expect(screen.getByRole("img")).toHaveClass("border-border", "rounded-sm", "border", "object-cover", "h-auto");
  });

  it("should set the portrait beside the text, and let it wrap below when there is no room", () => {
    render(<ArtistArticle {...mockProps} />);

    const layout = screen.getByRole("img").parentElement;
    expect(layout).toHaveClass("flex", "flex-wrap", "items-start", "gap-10");

    // The portrait keeps its own width; the text takes what is left and
    // carries the minimum below which it drops to the next line.
    expect(screen.getByRole("img")).toHaveClass("max-w-3xs");
    expect(screen.getAllByText(/paragraphe/)[0].parentElement).toHaveClass("min-w-2xs", "flex-1");
  });

  it("should keep the name in the outline but off screen when the banner shows it", () => {
    render(<ArtistArticle {...mockProps} hLevel={1} titleHidden />);

    const heading = screen.getByRole("heading", { name: mockProps.name, level: 1 });
    expect(heading).toHaveClass("sr-only");
  });

  it("should handle special characters in text", () => {
    const specialCharsProps = {
      ...mockProps,
      text: ["Texte avec des caractères spéciaux : àéèêëîïôöùûüÿç", "Guillemets « français » et apostrophes d'usage"],
    };

    render(<ArtistArticle {...specialCharsProps} />);

    expect(screen.getByText(/caractères spéciaux/)).toBeInTheDocument();
    expect(screen.getByText(/Guillemets/)).toBeInTheDocument();
  });
});
