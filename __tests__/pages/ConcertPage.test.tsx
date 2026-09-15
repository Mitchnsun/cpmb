import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import ConcertPage, { generateMetadata, generateStaticParams, revalidate } from "@/app/nos-concerts/[slug]/page";
import concerts from "@/assets/contents/concerts.json";

/** The concert given twice in June 2025, the reference of CPMB-14. */
const GLORIA = concerts[0];

/** A day when every concert of the data is behind us. */
const AFTER_EVERYTHING = new Date("2026-09-15T12:00:00Z");

/** A day when the June 2025 concert is still ahead. */
const BEFORE_GLORIA = new Date("2025-06-01T12:00:00Z");

const renderConcert = async (slug: string) => render(await ConcertPage({ params: Promise.resolve({ slug }) }));

describe("ConcertPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(AFTER_EVERYTHING);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render concert when slug is found", async () => {
    await renderConcert(GLORIA.slug);

    expect(screen.getByRole("heading", { level: 1, name: GLORIA.title })).toBeInTheDocument();
  });

  it("should call notFound when slug is not found", async () => {
    const { notFound } = await import("next/navigation");

    try {
      await ConcertPage({ params: Promise.resolve({ slug: "non-existent-slug" }) });
    } catch {
      // notFound throws an error to stop execution
    }

    expect(notFound).toHaveBeenCalled();
  });

  it("should say which season the concert belongs to, and whether it has passed", async () => {
    await renderConcert(GLORIA.slug);

    expect(screen.getByText("Concert passé — saison 2024 – 2025")).toBeInTheDocument();
  });

  it("should announce a concert still ahead as upcoming", async () => {
    vi.setSystemTime(BEFORE_GLORIA);

    await renderConcert(GLORIA.slug);

    expect(screen.getByText("Concert à venir — saison 2024 – 2025")).toBeInTheDocument();
  });

  it("should go back to the agenda on the season the visitor left", async () => {
    await renderConcert(GLORIA.slug);

    expect(screen.getByRole("link", { name: "Retour aux concerts" })).toHaveAttribute(
      "href",
      "/nos-concerts#saison-2024-2025"
    );
  });

  it("should list every performance with its date and time", async () => {
    await renderConcert(GLORIA.slug);

    expect(screen.getByText("14 juin 2025 à 20h30")).toBeInTheDocument();
    expect(screen.getByText("15 juin 2025 à 18h00")).toBeInTheDocument();
    expect(screen.getByText(GLORIA.location)).toBeInTheDocument();
  });

  it("should show the poster with an alt describing the concert", async () => {
    await renderConcert(GLORIA.slug);

    expect(screen.getByAltText(`Affiche du concert : ${GLORIA.title}`)).toBeInTheDocument();
  });

  it("should list the programme and the performers", async () => {
    await renderConcert(GLORIA.slug);

    expect(screen.getByRole("heading", { level: 2, name: "Au programme" })).toBeInTheDocument();
    expect(screen.getByText("Gloria — Antonio Vivaldi")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Avec" })).toBeInTheDocument();
    expect(screen.getByText("Benoît Dubu, direction")).toBeInTheDocument();
  });

  it("should hide the programme and performers sections when the concert has neither", async () => {
    const bare = concerts.find((c) => !c.programme && !c.performers);

    await renderConcert(bare!.slug);

    expect(screen.queryByRole("heading", { name: "Au programme" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Avec" })).not.toBeInTheDocument();
  });

  it("should always offer to write to the choir", async () => {
    await renderConcert(GLORIA.slug);

    expect(screen.getByRole("link", { name: "Nous contacter" })).toHaveAttribute("href", "/contact");
  });

  it("should offer the calendar file only while the concert is ahead", async () => {
    await renderConcert(GLORIA.slug);
    expect(screen.queryByRole("link", { name: /Ajouter à mon agenda/ })).not.toBeInTheDocument();

    vi.setSystemTime(BEFORE_GLORIA);
    await renderConcert(GLORIA.slug);
    expect(screen.getByRole("link", { name: /Ajouter à mon agenda/ })).toHaveAttribute(
      "href",
      `/nos-concerts/${GLORIA.slug}/concert.ics`
    );
  });

  it("should generate static params for all concerts", async () => {
    const params = await generateStaticParams();

    expect(params).toHaveLength(concerts.length);
    expect(params[0]).toEqual({ slug: GLORIA.slug });
  });

  it("should generate metadata for existing concert", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: GLORIA.slug }) });

    expect(metadata.title).toBe(`${GLORIA.title} | Chœur des Pays du Mont-Blanc`);
    expect(metadata.description).toBe(GLORIA.description);
  });

  it("should generate default metadata for non-existent concert", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "non-existent-slug" }) });

    expect(metadata.title).toBe("Concert non trouvé");
  });

  it("should be rebuilt hourly, like the agenda", () => {
    expect(revalidate).toBe(3600);
  });
});
