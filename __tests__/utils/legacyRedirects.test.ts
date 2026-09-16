import articles from "@/assets/contents/articles.json";
import concerts from "@/assets/contents/concerts.json";
import { legacyRedirects } from "@/utils/legacyRedirects";

const RULES = legacyRedirects();

const find = (source: string) => RULES.find((rule) => rule.source === source);

/** Position of a rule, to check what the wildcards cannot swallow first. */
const indexOf = (source: string) => RULES.findIndex((rule) => rule.source === source);

describe("legacyRedirects", () => {
  it("should send an archived concert to its own page", () => {
    expect(
      find(
        "/nos-concerts/concerts-passes/110-concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais-les-bains"
      )?.destination
    ).toBe("/nos-concerts/concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais");
  });

  it("should answer the same article under either concert menu", () => {
    expect(
      find(
        "/nos-concerts/prochains-concerts/112-concert-autour-de-la-misa-criolla-les-7-et-28-juin-2026-a-vongy-et-a-boege"
      )?.destination
    ).toBe("/nos-concerts/concert-autour-de-la-misa-criolla-7-et-28-juin-2026-vongy-et-boege");
  });

  it("should send a press clipping to its article", () => {
    expect(find("/presentation/presse/48-le-chenois-juin-2015")?.destination).toBe(
      "/presse/dans-les-cours-de-musicenanglais"
    );
  });

  it("should land every concert destination on a concert that exists", () => {
    const slugs = new Set(concerts.map((concert) => concert.slug));

    const dangling = RULES.filter(
      (rule) =>
        rule.destination.startsWith("/nos-concerts/") && !slugs.has(rule.destination.replace("/nos-concerts/", ""))
    );

    expect(dangling).toEqual([]);
  });

  it("should land every press destination on an article that exists", () => {
    const slugs = new Set(articles.map((article) => article.slug));

    const dangling = RULES.filter(
      (rule) => rule.destination.startsWith("/presse/") && !slugs.has(rule.destination.replace("/presse/", ""))
    );

    expect(dangling).toEqual([]);
  });

  it("should keep the wildcards last, so a named page is never swallowed", () => {
    const firstWildcard = RULES.findIndex((rule) => rule.source.includes(":path*"));
    const named = RULES.filter((rule, index) => index > firstWildcard && !rule.source.includes(":path*"));

    expect(named.filter((rule) => rule.source.startsWith("/nos-concerts/concerts-passes/"))).toEqual([]);
    expect(indexOf("/nos-concerts/concerts-passes/5-mentions-legales")).toBeLessThan(firstWildcard);
  });

  it("should catch a legacy address nobody listed", () => {
    expect(find("/nos-concerts/concerts-passes/:path*")?.destination).toBe("/nos-concerts");
    expect(find("/presentation/presse/:path*")?.destination).toBe("/presse");
  });

  it("should read the legal notice out of the old query-string addresses", () => {
    const rule = RULES.find((item) => item.has?.[0]?.value === "5:mentions-legales");

    expect(rule).toMatchObject({ source: "/", destination: "/mentions-legales" });
    expect(rule?.has?.[0]).toEqual({ type: "query", key: "id", value: "5:mentions-legales" });
  });

  it("should never point an old address at another old address", () => {
    /* The rules on "/" only fire on a Joomla query, so landing on the home
       page is an arrival, not a second hop. */
    const unconditional = new Set(RULES.filter((rule) => !rule.has).map((rule) => rule.source));

    expect(RULES.filter((rule) => unconditional.has(rule.destination.split("?")[0] ?? ""))).toEqual([]);
  });

  it("should declare each source once", () => {
    const sources = RULES.filter((rule) => !rule.has).map((rule) => rule.source);

    expect(new Set(sources).size).toBe(sources.length);
  });
});
