import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ContactPage from "@/app/contact/page";

// Mock the ContactForm component
vi.mock("@/components/ContactForm", () => ({
  default: () => <div data-testid="contact-form">Mocked Contact Form</div>,
}));

describe("ContactPage", () => {
  it("should render the contact page with proper structure", () => {
    render(<ContactPage />);

    // Check main heading
    expect(screen.getByRole("heading", { level: 1, name: "Contactez-nous" })).toBeInTheDocument();

    // Check contact information section
    expect(screen.getByRole("heading", { level: 2, name: "Informations pratiques" })).toBeInTheDocument();

    // Check form section
    expect(screen.getByRole("heading", { level: 2, name: "Envoyez-nous un message" })).toBeInTheDocument();

    // Check mocked contact form is rendered
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });

  it("should display email contact information", () => {
    render(<ContactPage />);

    // Check email link
    const emailLink = screen.getByRole("link", { name: "bureau@choeurdespaysdumontblanc.fr" });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:bureau@choeurdespaysdumontblanc.fr");
  });

  it("should display recruitment information", () => {
    render(<ContactPage />);

    expect(screen.getByText("Rejoignez-nous")).toBeInTheDocument();
    expect(screen.getByText(/Nous recrutons des choristes ayant une expérience chorale/)).toBeInTheDocument();
  });

  it("should have proper grid layout structure", () => {
    const { container } = render(<ContactPage />);

    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass("grid", "gap-8", "md:grid-cols-2");
  });

  it("should have accessible heading hierarchy", () => {
    render(<ContactPage />);

    const h1 = screen.getByRole("heading", { level: 1 });
    const h2Elements = screen.getAllByRole("heading", { level: 2 });
    const h3Elements = screen.getAllByRole("heading", { level: 3 });

    expect(h1).toBeInTheDocument();
    expect(h2Elements).toHaveLength(2);
    expect(h3Elements).toHaveLength(2);
  });
});
