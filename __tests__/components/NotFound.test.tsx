import { render, screen } from "@testing-library/react";

import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("should render not found page with correct content", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "Page non trouvée" })).toBeInTheDocument();
    expect(screen.getByText("Désolé, la page que vous recherchez n'existe pas.")).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: "Retour à l'accueil" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
