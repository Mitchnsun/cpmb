import { render, screen } from "@testing-library/react";

import Concert from "@/components/Concert";

describe("Concert Component", () => {
  const defaultProps = {
    title: "Concert de Noël",
    slug: "concert-noel-2024",
    date: ["2024-12-13T20:00:00+01:00"],
    description:
      "Un magnifique concert de Noël avec le Chœur des Pays du Mont-Blanc dans une ambiance festive et chaleureuse.",
    location: "Église Saint-Pierre, Gaillard",
    media: "/concerts/concert-noel-2024.jpg",
  };

  it("should render with all required props", () => {
    render(<Concert {...defaultProps} />);

    // Check title
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Concert de Noël");

    // Check image
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/concerts/concert-noel-2024.jpg");
    expect(image).toHaveAttribute("alt", "Affiche: Concert de Noël");

    // Check date with calendar icon
    const dateText = screen.getByText("13 décembre 2024 à 20h00");
    expect(dateText).toBeInTheDocument();

    // Check location with location icon
    const locationText = screen.getByText("Église Saint-Pierre, Gaillard");
    expect(locationText).toBeInTheDocument();

    // Check truncated description
    expect(screen.getByText(/Un magnifique concert de Noël/)).toBeInTheDocument();

    // Check "En savoir plus" link
    const link = screen.getByRole("link", { name: /En savoir plus/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/nos-concerts/concert-noel-2024");
  });

  it("should render multiple dates correctly", () => {
    const propsWithMultipleDates = {
      ...defaultProps,
      date: ["2024-12-13T20:00:00+01:00", "2024-12-14T15:00:00+01:00"],
    };

    render(<Concert {...propsWithMultipleDates} />);

    const dateText = screen.getByText("13 décembre 2024 à 20h00, 14 décembre 2024 à 15h00");
    expect(dateText).toBeInTheDocument();
  });

  it("should truncate long descriptions", () => {
    const longDescription =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

    const propsWithLongDescription = {
      ...defaultProps,
      description: longDescription,
    };

    render(<Concert {...propsWithLongDescription} />);

    // Should contain truncated text with ellipsis
    const descriptionElement = screen.getByText(/Lorem ipsum dolor sit amet/);
    expect(descriptionElement.textContent).toContain("...");
    expect(descriptionElement.textContent?.length).toBeLessThan(longDescription.length);
  });

  it("should have correct image dimensions and styling", () => {
    render(<Concert {...defaultProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("height", "250");
    expect(image).toHaveAttribute("width", "150");
  });

  it("should render heading with correct variant", () => {
    render(<Concert {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
  });

  it("should handle empty or single date array", () => {
    const propsWithSingleDate = {
      ...defaultProps,
      date: ["2024-12-13T20:00:00+01:00"],
    };

    render(<Concert {...propsWithSingleDate} />);

    const dateText = screen.getByText("13 décembre 2024 à 20h00");
    expect(dateText).toBeInTheDocument();
    expect(dateText.textContent).not.toContain(",");
  });

  it("should format dates in French timezone correctly", () => {
    const propsWithDifferentTime = {
      ...defaultProps,
      date: ["2024-06-15T14:30:00+02:00"], // Summer time
    };

    render(<Concert {...propsWithDifferentTime} />);

    const dateText = screen.getByText("15 juin 2024 à 14h30");
    expect(dateText).toBeInTheDocument();
  });

  it("should render correctly without description", () => {
    const propsWithoutDescription = {
      ...defaultProps,
      description: undefined,
    };

    render(<Concert {...propsWithoutDescription} />);

    // Title should still be present
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Concert de Noël");

    // Date and location should still be present
    expect(screen.getByText("13 décembre 2024 à 20h00")).toBeInTheDocument();
    expect(screen.getByText("Église Saint-Pierre, Gaillard")).toBeInTheDocument();

    // "En savoir plus" link should still be present
    const link = screen.getByRole("link", { name: /En savoir plus/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/nos-concerts/concert-noel-2024");

    // No description text should be visible
    expect(screen.queryByText(/Un magnifique concert de Noël/)).not.toBeInTheDocument();
  });

  it("should apply correct link classes based on description length", () => {
    // Test with description longer than 150 characters
    const longDescription = "A".repeat(200);
    const propsWithLongDescription = {
      ...defaultProps,
      description: longDescription,
    };

    const { rerender } = render(<Concert {...propsWithLongDescription} />);

    expect(screen.getByRole("link", { name: /En savoir plus/i })).toHaveClass("inline-block");

    // Test with description shorter than or equal to 150 characters
    const shortDescription = "A".repeat(100);
    const propsWithShortDescription = {
      ...defaultProps,
      description: shortDescription,
    };

    rerender(<Concert {...propsWithShortDescription} />);

    expect(screen.getByRole("link", { name: /En savoir plus/i })).toHaveClass("block");
  });
});
