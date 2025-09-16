import { render, screen } from "@testing-library/react";
import type { ImageProps } from "next/image";
import Footer from "@/components/Footer";

// Mock Next.js components
vi.mock("next/image", () => ({
  default: ({ src, alt, width, height, className }: ImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

describe("Footer", () => {
  beforeEach(() => {
    // Mock Date.getFullYear() to return a consistent year for testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the footer element", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  describe("Partner logos section", () => {
    it("should render all partner logos with correct attributes", () => {
      render(<Footer />);

      // Veran Piano
      const veranLogo = screen.getByAltText("Logo Veran Piano");
      expect(veranLogo).toBeInTheDocument();
      expect(veranLogo).toHaveAttribute("src", "/logo-veran-pianos.png");
      expect(veranLogo).toHaveAttribute("width", "200");
      expect(veranLogo).toHaveAttribute("height", "120");

      // Gaillard
      const gaillardLogo = screen.getByAltText("Logo Ville de Gaillard");
      expect(gaillardLogo).toBeInTheDocument();
      expect(gaillardLogo).toHaveAttribute("src", "/logo-gaillard.png");
      expect(gaillardLogo).toHaveAttribute("width", "200");
      expect(gaillardLogo).toHaveAttribute("height", "120");

      // Haute-Savoie
      const hauteSavoieLogo = screen.getByAltText("Logo Haute-Savoie");
      expect(hauteSavoieLogo).toBeInTheDocument();
      expect(hauteSavoieLogo).toHaveAttribute("src", "/haute-savoie.svg");
      expect(hauteSavoieLogo).toHaveAttribute("width", "90");
      expect(hauteSavoieLogo).toHaveAttribute("height", "55");
    });

    it("should have partner links with correct URLs and accessibility attributes", () => {
      render(<Footer />);

      // Veran Piano link
      const veranLink = screen.getByLabelText("Visitez le site de Veran Piano - nouvelle fenêtre");
      expect(veranLink).toHaveAttribute("href", "https://www.veran-piano.com/");
      expect(veranLink).toHaveAttribute("target", "_blank");
      expect(veranLink).toHaveAttribute("rel", "noopener noreferrer");

      // Gaillard link
      const gaillardLink = screen.getByLabelText("Visitez le site de la Ville de Gaillard - nouvelle fenêtre");
      expect(gaillardLink).toHaveAttribute("href", "https://www.gaillard.fr/");
      expect(gaillardLink).toHaveAttribute("target", "_blank");
      expect(gaillardLink).toHaveAttribute("rel", "noopener noreferrer");

      // Haute-Savoie link
      const hauteSavoieLink = screen.getByLabelText(
        "Visitez le site du Département de la Haute-Savoie - nouvelle fenêtre"
      );
      expect(hauteSavoieLink).toHaveAttribute("href", "https://www.hautesavoie.fr/");
      expect(hauteSavoieLink).toHaveAttribute("target", "_blank");
      expect(hauteSavoieLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Main footer section", () => {
    it("should render the CPMB logo and description", () => {
      render(<Footer />);

      const logo = screen.getByAltText("Logo Chœur des Pays du Mont-Blanc");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/CPMB-logo-blanc.png");
      expect(logo).toHaveAttribute("width", "160");
      expect(logo).toHaveAttribute("height", "55");

      const description = screen.getByText("Partager la passion de la musique chorale au cœur des Alpes.");
      expect(description).toBeInTheDocument();
    });

    it("should render the partners section with correct links", () => {
      render(<Footer />);

      expect(screen.getByRole("heading", { name: "Nos Partenaires" })).toBeInTheDocument();

      // Partner links in the text list
      const veranTextLink = screen.getByRole("link", { name: "Veran Piano" });
      expect(veranTextLink).toHaveAttribute("href", "https://www.veran-piano.com/");
      expect(veranTextLink).toHaveAttribute("target", "_blank");
      expect(veranTextLink).toHaveAttribute("rel", "noopener noreferrer");

      const gaillardTextLink = screen.getByRole("link", { name: "Ville de Gaillard" });
      expect(gaillardTextLink).toHaveAttribute("href", "https://www.gaillard.fr/");
      expect(gaillardTextLink).toHaveAttribute("target", "_blank");
      expect(gaillardTextLink).toHaveAttribute("rel", "noopener noreferrer");

      const hauteSavoieTextLink = screen.getByRole("link", { name: "Département de la Haute-Savoie" });
      expect(hauteSavoieTextLink).toHaveAttribute("href", "https://www.hautesavoie.fr/");
      expect(hauteSavoieTextLink).toHaveAttribute("target", "_blank");
      expect(hauteSavoieTextLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render the site map section with internal links", () => {
      render(<Footer />);

      expect(screen.getByRole("heading", { name: "Plan du site" })).toBeInTheDocument();

      const homeLink = screen.getByRole("link", { name: "Page d'accueil" });
      expect(homeLink).toHaveAttribute("href", "/");

      const legalLink = screen.getByRole("link", { name: "Mentions légales" });
      expect(legalLink).toHaveAttribute("href", "/mentions-legales");
    });

    it("should render the copyright notice with current year", () => {
      render(<Footer />);

      const copyright = screen.getByText("© 2024 Chœur des Pays du Mont-Blanc. Tous droits réservés.");
      expect(copyright).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      render(<Footer />);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
      expect(footer.tagName).toBe("FOOTER");
    });

    it("should have proper heading hierarchy", () => {
      render(<Footer />);

      const headings = screen.getAllByRole("heading");
      expect(headings).toHaveLength(2);

      const partnersHeading = screen.getByRole("heading", { name: "Nos Partenaires" });
      expect(partnersHeading.tagName).toBe("H4");

      const siteMapHeading = screen.getByRole("heading", { name: "Plan du site" });
      expect(siteMapHeading.tagName).toBe("H4");
    });

    it("should have proper ARIA labels for external links", () => {
      render(<Footer />);

      // Check that all external links have proper aria-labels
      const externalLinksWithLabels = [
        "Visitez le site de Veran Piano - nouvelle fenêtre",
        "Visitez le site de la Ville de Gaillard - nouvelle fenêtre",
        "Visitez le site du Département de la Haute-Savoie - nouvelle fenêtre",
      ];

      externalLinksWithLabels.forEach((label) => {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      });
    });

    it("should have proper security attributes for external links", () => {
      render(<Footer />);

      const externalLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("http"));

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("Responsive design classes", () => {
    it("should have responsive layout classes", () => {
      render(<Footer />);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveClass("font-noto");

      // Check for responsive flex classes in main content
      const mainContent = footer.querySelector(
        ".container.mx-auto.flex.flex-col.items-start.gap-4.py-4.lg\\:flex-row.lg\\:gap-24"
      );
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe("Content validation", () => {
    it("should contain all expected text content", () => {
      render(<Footer />);

      // Main description
      expect(screen.getByText("Partager la passion de la musique chorale au cœur des Alpes.")).toBeInTheDocument();

      // Section headings
      expect(screen.getByText("Nos Partenaires")).toBeInTheDocument();
      expect(screen.getByText("Plan du site")).toBeInTheDocument();

      // Partner names
      expect(screen.getByText("Veran Piano")).toBeInTheDocument();
      expect(screen.getByText("Ville de Gaillard")).toBeInTheDocument();
      expect(screen.getByText("Département de la Haute-Savoie")).toBeInTheDocument();

      // Site map links
      expect(screen.getByText("Page d'accueil")).toBeInTheDocument();
      expect(screen.getByText("Mentions légales")).toBeInTheDocument();
    });
  });
});
