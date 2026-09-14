import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import HeaderNav from "@/components/HeaderNav";

describe("HeaderNav", () => {
  it("should keep a 44px touch target on every link", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<HeaderNav />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link).toHaveClass("min-h-11");
    });
  });

  it("should give inactive links a transparent border to avoid any height shift", () => {
    vi.mocked(usePathname).mockReturnValue("/contact");
    render(<HeaderNav />);

    const inactive = screen.getByRole("link", { name: "Présentation" });
    expect(inactive).toHaveClass("border-b-2", "border-transparent");
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("should mark a single link as active, and only the right one", () => {
    vi.mocked(usePathname).mockReturnValue("/nos-concerts");
    render(<HeaderNav />);

    const active = screen.getAllByRole("link").filter((link) => link.getAttribute("aria-current") === "page");
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent("Nos concerts");
  });

  it("should leave every link inactive on the home page", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    render(<HeaderNav />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
    });
  });
});
