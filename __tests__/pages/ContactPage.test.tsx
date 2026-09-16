import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ContactPage from "@/app/contact/page";

vi.mock("@/components/ContactForm", () => ({
  default: () => <div data-testid="contact-form">Mocked Contact Form</div>,
}));

describe("ContactPage", () => {
  it("should open on the charter banner", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
    expect(screen.getByText("Écrire au chœur")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      "Les choristes du Chœur des Pays du Mont-Blanc, écharpes turquoise"
    );
  });

  it("should put the practical information and the form side by side", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { level: 2, name: "Informations pratiques" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Envoyez-nous un message" })).toBeInTheDocument();
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });

  it("should give the choir's e-mail address as a link", () => {
    render(<ContactPage />);

    const emailLink = screen.getByRole("link", { name: "bureau@choeurdespaysdumontblanc.fr" });
    expect(emailLink).toHaveAttribute("href", "mailto:bureau@choeurdespaysdumontblanc.fr");
  });

  it("should say who the choir is recruiting", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { level: 3, name: "Rejoignez-nous" })).toBeInTheDocument();
    expect(screen.getByText(/Nous recrutons des choristes ayant une expérience chorale/)).toBeInTheDocument();
  });

  it("should give the place and the hours of the rehearsals", () => {
    render(<ContactPage />);

    expect(screen.getByRole("heading", { level: 3, name: "Répétitions" })).toBeInTheDocument();
    expect(screen.getByText(/Espace Louis-Simon, salle Roger Duvanel/)).toBeInTheDocument();
    expect(screen.getByText(/Un vendredi par mois, 19h30 – 22h/)).toBeInTheDocument();
  });

  it("should keep a single h1 and an unbroken heading hierarchy", () => {
    render(<ContactPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});
