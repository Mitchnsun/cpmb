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

    // Vérifie que l'article est rendu
    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass("container", "mx-auto", "text-justify");

    // Vérifie que le titre est rendu avec le nom de l'artiste
    const heading = screen.getByRole("heading", { name: mockProps.name });
    expect(heading).toBeInTheDocument();

    // Vérifie que l'image est rendue avec les bonnes propriétés
    const image = screen.getByRole("img", { name: mockProps.alt });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockProps.media);
    expect(image).toHaveAttribute("alt", mockProps.alt);
    expect(image).toHaveAttribute("width", "200");
    expect(image).toHaveAttribute("height", "300");

    // Vérifie que tous les paragraphes de texte sont rendus
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

  it("should apply correct spacing between paragraphs", () => {
    render(<ArtistArticle {...mockProps} />);

    const paragraphs = screen.getAllByText(/paragraphe/);

    // Vérifie que tous les paragraphes sauf le dernier ont la classe mb-2
    paragraphs.forEach((paragraph, index) => {
      if (index < paragraphs.length - 1) {
        expect(paragraph).toHaveClass("mb-2");
      } else {
        expect(paragraph).not.toHaveClass("mb-2");
      }
    });
  });

  it("should render with single paragraph", () => {
    const singleParagraphProps = {
      ...mockProps,
      text: ["Un seul paragraphe de texte."],
    };

    render(<ArtistArticle {...singleParagraphProps} />);

    const paragraph = screen.getByText("Un seul paragraphe de texte.");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).not.toHaveClass("mb-2");
  });

  it("should render with empty text array", () => {
    const emptyTextProps = {
      ...mockProps,
      text: [],
    };

    render(<ArtistArticle {...emptyTextProps} />);

    // Vérifie que l'article et l'image sont toujours rendus
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: mockProps.name })).toBeInTheDocument();
  });

  it("should apply responsive image classes", () => {
    render(<ArtistArticle {...mockProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveClass(
      "mx-auto",
      "h-80",
      "w-full",
      "max-w-3xs",
      "grow-0",
      "rounded-md",
      "object-cover",
      "lg:m-0",
      "lg:h-auto"
    );
  });

  it("should apply correct flex layout classes", () => {
    render(<ArtistArticle {...mockProps} />);

    const contentDiv = screen.getByRole("img").parentElement;
    expect(contentDiv).toHaveClass(
      "flex",
      "flex-col",
      "items-start",
      "gap-4",
      "text-justify",
      "sm:flex-row",
      "lg:gap-8"
    );
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
