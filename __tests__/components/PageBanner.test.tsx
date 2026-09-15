import { render, screen } from "@testing-library/react";

import { CONCERTS_BANNER } from "@/assets/contents/medias";
import PageBanner from "@/components/PageBanner";

describe("PageBanner", () => {
  it("should render the overline above the page title", () => {
    render(<PageBanner overline="Agenda" title="Nos concerts" />);

    expect(screen.getByText("Agenda")).toHaveClass("font-mono", "uppercase");
    expect(screen.getByRole("heading", { level: 1, name: "Nos concerts" })).toHaveClass("font-display", "text-h1");
  });

  it("should show the photo with its written alt and its crop", () => {
    render(<PageBanner overline="Agenda" title="Nos concerts" image={CONCERTS_BANNER} />);

    expect(screen.getByAltText(CONCERTS_BANNER.alt)).toBeInTheDocument();
  });

  it("should stay plain stage black when no photo is given", () => {
    const { container } = render(<PageBanner overline="Informations légales" title="Mentions légales" />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("should hide the decorative ridge from assistive technologies", () => {
    const { container } = render(<PageBanner overline="Agenda" title="Nos concerts" image={CONCERTS_BANNER} />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("should offer the back link when the page has one", () => {
    render(
      <PageBanner
        overline="Concert passé — saison 2024 – 2025"
        title="Concert Gloria"
        backLink={{ href: "/nos-concerts#saison-2024-2025", label: "Retour aux concerts" }}
      />
    );

    expect(screen.getByRole("link", { name: "Retour aux concerts" })).toHaveAttribute(
      "href",
      "/nos-concerts#saison-2024-2025"
    );
  });

  it("should leave out the back link on a page that has none", () => {
    render(<PageBanner overline="Agenda" title="Nos concerts" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
