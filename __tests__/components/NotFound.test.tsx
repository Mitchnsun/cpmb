import { render, screen } from "@testing-library/react";

import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("should open on the charter banner", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1, name: "Page non trouvée" })).toBeInTheDocument();
    expect(screen.getByText("Erreur 404")).toBeInTheDocument();
  });

  it("should say what happened and offer the way back", () => {
    render(<NotFound />);

    expect(screen.getByText(/la page que vous recherchez n'existe pas ou n'existe plus/)).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: "Retour à l'accueil" });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveClass("bg-teal", "text-white");
  });

  it("should not claim the illustration as the site's priority image", () => {
    render(<NotFound />);

    expect(screen.getByRole("img")).not.toHaveAttribute("priority");
  });
});
