import concerts from "@/assets/contents/concerts.json";
import { type Concert } from "@/utils/concerts";
import { concertEvents, parsePlace } from "@/utils/structuredData";

const concertOf = (slug: string): Concert => concerts.find((concert) => concert.slug === slug)!;

describe("parsePlace", () => {
  it("should read a venue, a town and a country", () => {
    expect(parsePlace("Église Saint-Pierre, Gaillard, France")).toEqual({
      "@type": "Place",
      name: "Église Saint-Pierre",
      address: { "@type": "PostalAddress", addressLocality: "Gaillard", addressCountry: "FR" },
    });
  });

  it("should keep the town as the place when no venue is named", () => {
    expect(parsePlace("Vongy et Boëge, France")).toEqual({
      "@type": "Place",
      name: "Vongy et Boëge",
      address: { "@type": "PostalAddress", addressLocality: "Vongy et Boëge", addressCountry: "FR" },
    });
  });

  it("should carry no country when the location names none", () => {
    expect(parsePlace("Genève (CH) et Samoëns (F)").address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Genève (CH) et Samoëns (F)",
    });
  });

  it("should recognise Switzerland as well", () => {
    expect(parsePlace("Victoria Hall, Genève, Suisse").address.addressCountry).toBe("CH");
  });
});

describe("concertEvents", () => {
  const twoNights = concertOf("concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais");

  it("should describe one event per performance", () => {
    const events = concertEvents(twoNights);

    expect(events).toHaveLength(twoNights.date.length);
    expect(events.map((event) => event.startDate)).toEqual(twoNights.date);
  });

  it("should carry what a search engine needs to list the concert", () => {
    const [event] = concertEvents(twoNights);

    expect(event).toMatchObject({
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: twoNights.title,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      performer: { "@type": "MusicGroup", name: "Chœur des Pays du Mont-Blanc" },
      organizer: { "@type": "MusicGroup", name: "Chœur des Pays du Mont-Blanc" },
      url: `https://choeurdespaysdumontblanc.fr/nos-concerts/${twoNights.slug}`,
      image: `https://choeurdespaysdumontblanc.fr${twoNights.media}`,
    });
  });

  it("should leave out the image when the concert has no poster", () => {
    const bare = concerts.find((concert) => !concert.media)!;

    expect(concertEvents(bare)[0]).not.toHaveProperty("image");
  });

  it("should skip a date it cannot read rather than publish it broken", () => {
    const broken = { ...twoNights, date: ["pas une date", "2025-06-15T18:00:00+02:00"] };

    expect(concertEvents(broken).map((event) => event.startDate)).toEqual(["2025-06-15T18:00:00+02:00"]);
  });

  it("should describe every concert of the data without failing", () => {
    expect(concerts.flatMap((concert) => concertEvents(concert)).length).toBeGreaterThanOrEqual(concerts.length);
  });
});
