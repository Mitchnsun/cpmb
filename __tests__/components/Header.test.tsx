import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

import Header from "@/components/Header";

// Mock SVG imports
vi.mock("@/assets/icons/menu.svg", () => ({
  default: (props: SVGProps<SVGSVGElement>) => <svg data-testid="menu-icon" {...props} />,
}));

vi.mock("@/assets/icons/close.svg", () => ({
  default: (props: SVGProps<SVGSVGElement>) => <svg data-testid="close-icon" {...props} />,
}));

const mockPathname = (pathname: string) => vi.mocked(usePathname).mockReturnValue(pathname);

describe("Header", () => {
  beforeEach(() => {
    mockPathname("/");
  });

  it("should render a sticky banner with the logo linking to the home page", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("sticky", "top-0");

    const logoLink = screen.getByRole("link", { name: /chœur des pays du mont-blanc/i });
    expect(logoLink).toHaveAttribute("href", "/");
    expect(within(logoLink).getByRole("img")).toHaveAttribute("alt", "Chœur des Pays du Mont-Blanc");
  });

  it("should render the three main navigation links", () => {
    render(<Header />);

    const nav = screen.getByRole("navigation", { name: /navigation principale/i });
    const links = within(nav).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual(["Accueil", "Nos concerts", "Contact"]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/", "/nos-concerts", "/contact"]);
  });

  it.each([
    ["/", "Accueil"],
    ["/nos-concerts", "Nos concerts"],
    ["/contact", "Contact"],
    ["/nos-concerts/concert-de-noel-22-decembre-2024-gaillard", "Nos concerts"],
  ])("should mark the current page as active on %s", (pathname, expectedLabel) => {
    mockPathname(pathname);
    render(<Header />);

    const nav = screen.getByRole("navigation", { name: /navigation principale/i });
    const activeLinks = within(nav)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");

    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]).toHaveTextContent(expectedLabel);
    expect(activeLinks[0]).toHaveClass("border-teal");
  });

  it("should render a decorative equalizer hidden from screen readers", () => {
    const { container } = render(<Header />);

    const equalizer = container.querySelector('[aria-hidden="true"]');
    expect(equalizer).toBeInTheDocument();
    expect(equalizer?.children).toHaveLength(9);
    // Barres 5 et 9 en cuivre, les sept autres en turquoise.
    const barColors = [...(equalizer?.children ?? [])].map((bar) =>
      bar.className.includes("bg-copper") ? "copper" : "teal"
    );
    expect(barColors).toEqual(["teal", "teal", "teal", "teal", "copper", "teal", "teal", "teal", "copper"]);
  });

  it("should expose a 44px menu button that announces its expanded state", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: /ouvrir le menu/i });
    expect(menuButton).toHaveClass("size-11");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  it("should open and close the mobile menu", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: /ouvrir le menu/i });
    await user.click(menuButton);

    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("Navigation du site")).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Nos concerts" })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Contact" })).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /fermer le menu/i });
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();

    await user.click(closeButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("should move the focus inside the mobile menu when it opens", async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: /ouvrir le menu/i }));

    // Sans focus à l'intérieur du panneau, le piège de focus ne s'arme pas.
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("should close the mobile menu with the Escape key", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: /ouvrir le menu/i });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });
});
