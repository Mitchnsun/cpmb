import { render, screen } from "@testing-library/react";

import NotFound from "@/app/not-found";

describe("NotFound", () => {
  it("should render not found page with correct content", () => {
    render(<NotFound />);

    expect(screen.getByText("Page non trouvée")).toBeInTheDocument();
    expect(screen.getByText("Désolé, la page que vous recherchez n'existe pas.")).toBeInTheDocument();
    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });

  it("should have a link back to home", () => {
    render(<NotFound />);

    const homeLink = screen.getByText("Retour à l'accueil");
    expect(homeLink).toHaveAttribute("href", "/");
  });
});
