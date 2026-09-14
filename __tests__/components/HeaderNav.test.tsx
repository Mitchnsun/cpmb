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

    const inactive = screen.getByRole("link", { name: "Accueil" });
    expect(inactive).toHaveClass("border-b-2", "border-transparent");
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("should not mark the home link as active on another page", () => {
    vi.mocked(usePathname).mockReturnValue("/nos-concerts");
    render(<HeaderNav />);

    expect(screen.getByRole("link", { name: "Accueil" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Nos concerts" })).toHaveAttribute("aria-current", "page");
  });
});
