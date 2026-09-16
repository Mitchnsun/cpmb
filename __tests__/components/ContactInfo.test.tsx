import { render, screen } from "@testing-library/react";

import ContactInfo, { CONTACT_EMAIL } from "@/components/ContactInfo";

describe("ContactInfo", () => {
  it("should expose the choir's address as the single source used site-wide", () => {
    expect(CONTACT_EMAIL).toBe("bureau@choeurdespaysdumontblanc.fr");
  });

  it("should title the column and its three subheadings", () => {
    render(<ContactInfo />);

    expect(screen.getByRole("heading", { level: 2, name: "Informations pratiques" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Adresse e-mail",
      "Rejoignez-nous",
      "Répétitions",
    ]);
  });

  it("should link the e-mail address to a draft", () => {
    render(<ContactInfo />);

    expect(screen.getByRole("link", { name: CONTACT_EMAIL })).toHaveAttribute("href", `mailto:${CONTACT_EMAIL}`);
  });

  it("should mark the rehearsals panel with the copper accent of the archive", () => {
    const { container } = render(<ContactInfo />);

    expect(container.querySelector(".border-l-copper")).toHaveTextContent("Espace Louis-Simon, salle Roger Duvanel");
  });
});
