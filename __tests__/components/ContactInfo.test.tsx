import { render, screen } from "@testing-library/react";

import ContactInfo from "@/components/ContactInfo";
import { CONTACT_EMAIL } from "@/utils/site";

describe("ContactInfo", () => {
  it("should read the choir's address from the single site-wide source", () => {
    expect(CONTACT_EMAIL).toBe("bureau@choeurdespaysdumontblanc.fr");
    expect(screen.queryByText(CONTACT_EMAIL)).not.toBeInTheDocument();
    render(<ContactInfo />);
    expect(screen.getByText(CONTACT_EMAIL)).toBeInTheDocument();
  });

  it("should let the long address wrap, so it cannot overflow a narrow screen", () => {
    render(<ContactInfo />);

    expect(screen.getByRole("link", { name: CONTACT_EMAIL })).toHaveClass("wrap-anywhere");
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
