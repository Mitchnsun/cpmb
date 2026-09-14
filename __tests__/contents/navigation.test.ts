import { HOME_LINK, isNavLinkActive, LEGAL_LINK, NAV_LINKS, SITEMAP_LINKS } from "@/assets/contents/navigation";

describe("navigation", () => {
  it("should expose the four main entries in order", () => {
    expect(NAV_LINKS.map(({ label }) => label)).toEqual(["Présentation", "Nos concerts", "Presse", "Contact"]);
    expect(NAV_LINKS.map(({ href }) => href)).toEqual(["/presentation", "/nos-concerts", "/presse", "/contact"]);
  });

  it("should keep home and the legal page out of the main navigation", () => {
    expect(NAV_LINKS).not.toContainEqual(HOME_LINK);
    expect(NAV_LINKS).not.toContainEqual(LEGAL_LINK);
  });

  it("should list every page in the site map, home first and legal last", () => {
    expect(SITEMAP_LINKS).toEqual([HOME_LINK, ...NAV_LINKS, LEGAL_LINK]);
    expect(SITEMAP_LINKS.map(({ label }) => label)).toEqual([
      "Accueil",
      "Présentation",
      "Nos concerts",
      "Presse",
      "Contact",
      "Mentions légales",
    ]);
  });

  describe("isNavLinkActive", () => {
    it("should match the home page on an exact path only", () => {
      expect(isNavLinkActive("/", "/")).toBe(true);
      expect(isNavLinkActive("/", "/contact")).toBe(false);
      expect(isNavLinkActive("/", "/nos-concerts")).toBe(false);
    });

    it("should match a section on its own path", () => {
      expect(isNavLinkActive("/nos-concerts", "/nos-concerts")).toBe(true);
      expect(isNavLinkActive("/presentation", "/presentation")).toBe(true);
      expect(isNavLinkActive("/presse", "/presse")).toBe(true);
      expect(isNavLinkActive("/contact", "/contact")).toBe(true);
    });

    it.each([
      ["/nos-concerts", "/nos-concerts/concert-de-noel-22-decembre-2024-gaillard"],
      ["/presentation", "/presentation/benoit-dubu"],
      ["/presse", "/presse/le-choeur-des-pays-du-mont-blanc-a-conquis-le-public"],
    ])("should count a %s detail page as its section", (href, pathname) => {
      expect(isNavLinkActive(href, pathname)).toBe(true);
    });

    it("should not match a path that merely shares a prefix", () => {
      expect(isNavLinkActive("/contact", "/contactez-nous")).toBe(false);
      expect(isNavLinkActive("/presse", "/pressentiment")).toBe(false);
    });
  });
});
