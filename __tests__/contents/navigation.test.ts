import { isNavLinkActive, LEGAL_LINK, NAV_LINKS, SITEMAP_LINKS } from "@/assets/contents/navigation";

describe("navigation", () => {
  it("should expose the three main entries in order", () => {
    expect(NAV_LINKS.map(({ label }) => label)).toEqual(["Accueil", "Nos concerts", "Contact"]);
  });

  it("should append the legal link to the site map only", () => {
    expect(SITEMAP_LINKS).toEqual([...NAV_LINKS, LEGAL_LINK]);
    expect(NAV_LINKS).not.toContainEqual(LEGAL_LINK);
  });

  describe("isNavLinkActive", () => {
    it("should match the home page on an exact path only", () => {
      expect(isNavLinkActive("/", "/")).toBe(true);
      expect(isNavLinkActive("/", "/contact")).toBe(false);
      expect(isNavLinkActive("/", "/nos-concerts")).toBe(false);
    });

    it("should match a section on its own path", () => {
      expect(isNavLinkActive("/nos-concerts", "/nos-concerts")).toBe(true);
      expect(isNavLinkActive("/contact", "/contact")).toBe(true);
    });

    it("should count a concert page as the concerts section", () => {
      expect(isNavLinkActive("/nos-concerts", "/nos-concerts/concert-de-noel-22-decembre-2024-gaillard")).toBe(true);
    });

    it("should not match a path that merely shares a prefix", () => {
      expect(isNavLinkActive("/contact", "/contactez-nous")).toBe(false);
    });
  });
});
