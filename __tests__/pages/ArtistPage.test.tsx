import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ArtistPage, { generateMetadata, generateStaticParams } from "@/app/presentation/[artist]/page";
import Artists from "@/assets/contents/artists.json";

const SLUG = "agnes-lorincz";
const artist = Artists[SLUG];

describe("ArtistPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should title the page with the artist's name", async () => {
    render(await ArtistPage({ params: Promise.resolve({ artist: SLUG }) }));

    expect(screen.getByRole("heading", { level: 1, name: artist.name })).toBeInTheDocument();
    expect(screen.getByText("Interprète")).toBeInTheDocument();
  });

  it("should announce the name once, not twice", async () => {
    render(await ArtistPage({ params: Promise.resolve({ artist: SLUG }) }));

    // The banner is the h1; the portrait must not repeat it — not even
    // behind `sr-only`, which would still sit in the accessibility tree.
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(screen.queryByText(artist.name, { selector: ".sr-only" })).not.toBeInTheDocument();
  });

  it("should show the portrait and the biography", async () => {
    render(await ArtistPage({ params: Promise.resolve({ artist: SLUG }) }));

    expect(screen.getByRole("img", { name: artist.alt })).toHaveAttribute("src", artist.media);
    artist.text.forEach((paragraph) => expect(screen.getByText(paragraph)).toBeInTheDocument());
  });

  it("should offer a way back to the presentation page", async () => {
    render(await ArtistPage({ params: Promise.resolve({ artist: SLUG }) }));

    expect(screen.getByRole("link", { name: "Retour à la présentation" })).toHaveAttribute("href", "/presentation");
  });

  it("should call notFound for an unknown artist", async () => {
    const { notFound } = await import("next/navigation");

    try {
      await ArtistPage({ params: Promise.resolve({ artist: "personne" }) });
    } catch {
      // notFound throws to stop execution
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("should generate static params for every artist", async () => {
    const params = await generateStaticParams();

    expect(params).toHaveLength(Object.keys(Artists).length);
    expect(params).toContainEqual({ artist: SLUG });
  });

  it("should generate metadata from the artist's name", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ artist: SLUG }) });

    expect(metadata.title).toBe(artist.name);
  });

  it("should generate default metadata for an unknown artist", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ artist: "personne" }) });

    expect(metadata.title).toBe("Artiste non trouvé");
  });

  it("should describe itself as a Person, a member of the choir", async () => {
    const { container } = render(await ArtistPage({ params: Promise.resolve({ artist: SLUG }) }));

    const blocks = [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
      JSON.parse(node.textContent ?? "{}")
    );
    const person = blocks.find((block) => block["@type"] === "Person");

    expect(person).toMatchObject({ name: artist.name });

    /* Two of the three people profiled are instrumentalists who play with
       the choir, not members of it, and the data says nothing either way. */
    expect(person).not.toHaveProperty("memberOf");
  });

  it("should trail the artist with a breadcrumb from the home page", async () => {
    const { container } = render(await ArtistPage({ params: Promise.resolve({ artist: SLUG }) }));

    const blocks = [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
      JSON.parse(node.textContent ?? "{}")
    );
    const trail = blocks.find((block) => block["@type"] === "BreadcrumbList");

    expect(trail.itemListElement.map((item: { name: string }) => item.name)).toEqual([
      "Accueil",
      "Présentation",
      artist.name,
    ]);
  });
});
