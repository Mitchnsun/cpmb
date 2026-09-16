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

  it("should give each performance of a two-town concert its own venue", () => {
    const [boege, saintGervais] = concertEvents(twoNights);

    expect(boege.location).toEqual({
      "@type": "Place",
      name: "Boëge",
      address: { "@type": "PostalAddress", addressLocality: "Boëge", addressCountry: "FR" },
    });
    expect(saintGervais.location).toEqual({
      "@type": "Place",
      name: "Saint-Gervais-les-Bains",
      address: { "@type": "PostalAddress", addressLocality: "Saint-Gervais-les-Bains", addressCountry: "FR" },
    });
  });

  it("should split the venues of a two-town concert that names them both", () => {
    const acrossTheBorder = concertOf("messe-en-ut-de-mozart");

    expect(concertEvents(acrossTheBorder).map((event) => event.location.name)).toEqual([
      "Temple de la Madeleine",
      "Église de Gaillard (F)",
    ]);
  });

  it("should never invent a venue out of two towns joined on one line", () => {
    const invented = concerts
      .flatMap((concert) => concertEvents(concert))
      .filter((event) => / et /.test(event.location.name));

    expect(invented.map((event) => event.location.name)).toEqual([]);
  });

  it("should keep a single-date concert's location whole", () => {
    const oneNight = concertOf("concert-de-noel-22-decembre-2024-gaillard");

    expect(concertEvents(oneNight)[0].location).toEqual({
      "@type": "Place",
      name: "Église Saint-Pierre",
      address: { "@type": "PostalAddress", addressLocality: "Gaillard", addressCountry: "FR" },
    });
  });

  it("should leave a venue whose own name carries « et » in one piece", () => {
    const parish = {
      ...twoNights,
      location: "Église Saint-Pierre et Saint-Paul, Gaillard, France",
      date: ["2027-01-01"],
    };

    expect(concertEvents(parish)[0].location.name).toBe("Église Saint-Pierre et Saint-Paul");
  });

  it("should describe every concert of the data without failing", () => {
    expect(concerts.flatMap((concert) => concertEvents(concert)).length).toBeGreaterThanOrEqual(concerts.length);
  });
});
