import { render, screen } from "@testing-library/react";

import TextLink from "@/components/TextLink";

describe("TextLink", () => {
  it("should draw its underline with a border, not a text-decoration", () => {
    render(<TextLink href="/presse">Revue de presse</TextLink>);

    const link = screen.getByRole("link", { name: "Revue de presse" });
    expect(link).toHaveClass("border-b", "border-current", "no-underline");
  });

  it("should carry the teal-to-copper pair on a light background", () => {
    render(<TextLink href="/presse">Revue de presse</TextLink>);

    expect(screen.getByRole("link")).toHaveClass("text-teal", "hover:text-copper");
  });

  it("should switch to the light accents on stage black", () => {
    render(
      <TextLink href="/nos-concerts" tone="onDark">
        Retour aux concerts
      </TextLink>
    );

    expect(screen.getByRole("link")).toHaveClass("text-teal-light", "hover:text-copper-light");
  });

  it("should route an internal path through next/link", () => {
    render(<TextLink href="/contact">Contact</TextLink>);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/contact");
  });

  it.each([
    ["mailto:bureau@choeurdespaysdumontblanc.fr", "Nous écrire"],
    ["https://www.gaillard.fr/", "Ville de Gaillard"],
    ["#contact-name", "Le nom est requis"],
  ])("should leave %s as a plain anchor", (href, label) => {
    render(<TextLink href={href}>{label}</TextLink>);

    expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
  });

  it("should let the caller add classes without losing its own", () => {
    render(
      <TextLink href="/contact" className="mb-7 inline-block">
        Contact
      </TextLink>
    );

    expect(screen.getByRole("link")).toHaveClass("mb-7", "inline-block", "border-b");
  });
});
