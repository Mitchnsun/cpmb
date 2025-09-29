import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SVGProps } from "react";

import Header from "@/components/Header";

// Mock SVG imports
vi.mock("@/assets/icons/music-note.svg", () => ({
  default: (props: SVGProps<SVGSVGElement>) => <svg data-testid="music-note-icon" {...props} />,
}));

vi.mock("@/assets/icons/menu.svg", () => ({
  default: (props: SVGProps<SVGSVGElement>) => <svg data-testid="menu-icon" {...props} />,
}));

vi.mock("@/assets/icons/close.svg", () => ({
  default: (props: SVGProps<SVGSVGElement>) => <svg data-testid="close-icon" {...props} />,
}));

describe("Header", () => {
  it("should render the header with logo and title", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /chœur des pays du mont-blanc/i })).toBeInTheDocument();
  });

  it("should have correct link attributes", () => {
    render(<Header />);

    const link = screen.getByRole("link", { name: /chœur des pays du mont-blanc/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("should have proper semantic structure", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Check for sticky positioning classes
    expect(header).toHaveClass("sticky", "top-0");
  });

  it("should render the menu button", () => {
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: /ouvrir le menu/i });
    expect(menuButton).toBeInTheDocument();
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  it("should open and close drawer when menu button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: /ouvrir le menu/i });

    // Click to open drawer
    await user.click(menuButton);

    // Check if drawer is open (should show navigation)
    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("Navigation du site")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fermer le menu/i })).toBeInTheDocument();

    // Check if navigation links are present
    expect(screen.getByRole("link", { name: /présentation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nos concerts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /presse/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mentions légales/i })).toBeInTheDocument();
  });

  it("should show close button when drawer is open", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: /ouvrir le menu/i });

    // Open drawer
    await user.click(menuButton);
    expect(screen.getByText("Menu")).toBeInTheDocument();

    // Check close button is present
    const closeButton = screen.getByRole("button", { name: /fermer le menu/i });
    expect(closeButton).toBeInTheDocument();
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });
});
