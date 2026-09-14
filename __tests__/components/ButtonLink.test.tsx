import { render, screen } from "@testing-library/react";

import ButtonLink from "@/components/ButtonLink";

describe("ButtonLink", () => {
  it("should render a link at least 48px tall, with the charter radius", () => {
    render(<ButtonLink href="/nos-concerts">Voir tous les concerts</ButtonLink>);

    const link = screen.getByRole("link", { name: "Voir tous les concerts" });
    expect(link).toHaveAttribute("href", "/nos-concerts");
    expect(link).toHaveClass("min-h-12", "rounded-lg", "text-lg", "font-semibold");
  });

  it("should default to the tone used on the page background", () => {
    render(<ButtonLink href="/contact">Nous contacter</ButtonLink>);

    expect(screen.getByRole("link")).toHaveClass("bg-teal", "text-white", "hover:bg-teal-dark");
  });

  it.each([
    ["onDark", ["bg-teal-light", "text-stage-black", "hover:bg-copper-light"]],
    ["onTeal", ["bg-bg", "text-stage-black", "hover:bg-copper-light"]],
    ["outline", ["border-teal", "text-teal", "hover:bg-teal"]],
  ] as const)("should colour the %s tone from the charter", (tone, classNames) => {
    render(
      <ButtonLink href="/contact" tone={tone}>
        Nous contacter
      </ButtonLink>
    );

    expect(screen.getByRole("link")).toHaveClass(...classNames);
  });

  it("should override the global link colour on hover too", () => {
    render(
      <ButtonLink href="/contact" tone="onDark">
        Nous contacter
      </ButtonLink>
    );

    expect(screen.getByRole("link")).toHaveClass("hover:text-stage-black");
  });

  it("should merge extra classes over the variant ones", () => {
    render(
      <ButtonLink href="/contact" className="max-menu:w-full mt-5.5">
        Rejoindre le chœur
      </ButtonLink>
    );

    expect(screen.getByRole("link")).toHaveClass("mt-5.5", "max-menu:w-full");
  });
});
