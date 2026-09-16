import concerts from "@/assets/contents/concerts.json";
import { type Concert } from "@/utils/concerts";
import {
  breadcrumb,
  choirOrganization,
  concertEvents,
  concertList,
  parsePlace,
  personSchema,
  pressArticle,
} from "@/utils/structuredData";

const concertOf = (slug: string): Concert => concerts.find((concert) => concert.slug === slug)!;

describe("parsePlace", () => {
  it("should read a venue, a town and a country", () => {
    expect(parsePlace("Église Saint-Pierre, Gaillard, France")).toEqual({
      "@type": "Place",
      name: "Église Saint-Pierre",
      address: { "@type": "PostalAddress", addressLocality: "Gaillard", addressCountry: "FR" },
    });
  });

  it("should not pass a venue off as a municipality", () => {
    /* "Église de Vétraz-Monthoux" names a building, not a town, and nothing
       in the line says which town it stands in. */
    expect(parsePlace("Église de Vétraz-Monthoux, France")).toEqual({
      "@type": "Place",
      name: "Église de Vétraz-Monthoux",
      address: { "@type": "PostalAddress", addressCountry: "FR" },
    });
  });

  it("should keep the whole line as the place when it names one thing", () => {
    expect(parsePlace("Vongy et Boëge, France")).toEqual({
      "@type": "Place",
      name: "Vongy et Boëge",
      address: { "@type": "PostalAddress", addressCountry: "FR" },
    });
  });

  it("should read the country from a bracketed marker, and drop it from the name", () => {
    expect(parsePlace("Église de Gaillard (F)")).toEqual({
      "@type": "Place",
      name: "Église de Gaillard",
      address: { "@type": "PostalAddress", addressCountry: "FR" },
    });
    expect(parsePlace("Temple de Chêne-Bougeries (CH)").address.addressCountry).toBe("CH");
    expect(parsePlace("Eglise Notre Dame de l'Assomption, Évian (F)").address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Évian",
      addressCountry: "FR",
    });
  });

  it("should carry no country when the location names none", () => {
    expect(parsePlace("Espace Louis Simon, Gaillard").address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Gaillard",
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
      url: `https://choeurdespaysdumontblanc.fr/nos-concerts/${twoNights.slug}`,
      image: `https://choeurdespaysdumontblanc.fr${twoNights.media}`,
    });
  });

  it("should credit the choir for singing, never for organising", () => {
    /* Eight of these concerts were given at someone else's invitation, and
       who hosted an evening is nowhere in the data. */
    const events = concerts.flatMap((concert) => concertEvents(concert));

    expect(events.every((event) => event.performer.name === "Chœur des Pays du Mont-Blanc")).toBe(true);
    expect(events.filter((event) => "organizer" in event)).toEqual([]);
  });

  it("should leave out the image when the concert has no poster", () => {
    const bare = concerts.find((concert) => !concert.media)!;

    expect(concertEvents(bare)[0]).not.toHaveProperty("image");
  });

  it("should skip a date it cannot read rather than publish it broken", () => {
    const broken = { ...twoNights, date: ["pas une date", "2025-06-15T18:00:00+02:00"] };

    expect(concertEvents(broken).map((event) => event.startDate)).toEqual(["2025-06-15T18:00:00+02:00"]);
  });

  it("should take each performance's venue from the data", () => {
    const [boege, saintGervais] = concertEvents(twoNights);

    expect(boege.location).toEqual({
      "@type": "Place",
      name: "Boëge",
      address: { "@type": "PostalAddress", addressCountry: "FR" },
    });
    expect(saintGervais.location).toEqual({
      "@type": "Place",
      name: "Saint-Gervais-les-Bains",
      address: { "@type": "PostalAddress", addressCountry: "FR" },
    });
  });

  it("should publish a locality only where the data separates one", () => {
    const withTown = concertEvents(concertOf("concert-de-noel-22-decembre-2024-gaillard"))[0];
    const venueOnly = concertEvents(concertOf("musique-francaise-10-decembre-2022-vetraz-monthoux"))[0];

    expect(withTown.location.address.addressLocality).toBe("Gaillard");
    expect(venueOnly.location.address.addressLocality).toBeUndefined();
    expect(venueOnly.location.name).toBe("Église de Vétraz-Monthoux");
  });

  it("should keep each side's country on a cross-border concert", () => {
    const acrossTheBorder = concertOf("messe-en-ut-de-mozart");

    expect(concertEvents(acrossTheBorder).map((event) => event.location)).toEqual([
      {
        "@type": "Place",
        name: "Temple de la Madeleine",
        address: { "@type": "PostalAddress", addressLocality: "Genève", addressCountry: "CH" },
      },
      {
        "@type": "Place",
        name: "Église de Gaillard",
        address: { "@type": "PostalAddress", addressCountry: "FR" },
      },
    ]);
  });

  it("should leave no country unread where the data marks one", () => {
    const marked = concerts.filter((concert) => /\((CH|F|FR)\)/i.test(concert.location));

    const silent = marked
      .flatMap((concert) => concertEvents(concert))
      .filter((event) => !event.location.address.addressCountry);

    expect(silent.map((event) => event.location.name)).toEqual([]);
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

  it("should never cut a venue whose own name carries « et » in two", () => {
    /* Two dates, one church: nothing in "Saint-Pierre et Saint-Paul" says
       whether it is one venue or two, which is why the data states the
       venues rather than letting them be guessed from the sentence. */
    const parish = {
      ...twoNights,
      venues: undefined,
      location: "Église Saint-Pierre et Saint-Paul, Gaillard, France",
      date: ["2027-01-01", "2027-01-02"],
    };

    expect(concertEvents(parish).map((event) => event.location.name)).toEqual([
      "Église Saint-Pierre et Saint-Paul",
      "Église Saint-Pierre et Saint-Paul",
    ]);
  });

  it("should fall back to the whole line when the venues do not match the dates", () => {
    const mismatched = { ...twoNights, venues: ["Boëge, France"] };

    expect(concertEvents(mismatched).map((event) => event.location.name)).toEqual([
      "Boëge et Saint-Gervais-les-Bains",
      "Boëge et Saint-Gervais-les-Bains",
    ]);
  });

  it("should give every performance of a multi-venue concert a venue of its own", () => {
    /* Within one concert: the same place twice would mean the venues were
       never really read — across concerts, Vongy comes back, and should. */
    const repeated = concerts
      .filter((concert) => concert.date.length > 1 && concert.venues)
      .map((concert) => concertEvents(concert).map((event) => event.location.name))
      .filter((names) => new Set(names).size !== names.length);

    expect(repeated).toEqual([]);
  });

  it("should describe every concert of the data without failing", () => {
    expect(concerts.flatMap((concert) => concertEvents(concert)).length).toBeGreaterThanOrEqual(concerts.length);
  });
});

describe("choirOrganization", () => {
  it("should describe the choir as an entity a knowledge panel can read", () => {
    expect(choirOrganization()).toEqual({
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: "Chœur des Pays du Mont-Blanc",
      url: "https://choeurdespaysdumontblanc.fr",
      description: expect.any(String),
      foundingDate: "2005-03",
      email: "bureau@choeurdespaysdumontblanc.fr",
      logo: "https://choeurdespaysdumontblanc.fr/CPMB-logo-blanc.png",
      image: expect.stringMatching(/^https:\/\/choeurdespaysdumontblanc\.fr\//),
      areaServed: expect.any(Array),
      location: {
        "@type": "Place",
        name: "Espace Louis-Simon, salle Roger Duvanel",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Gaillard",
          postalCode: "74240",
          addressCountry: "FR",
        },
      },
    });
  });

  it("should carry no sameAs rather than a guessed social account", () => {
    expect(choirOrganization()).not.toHaveProperty("sameAs");
  });
});

describe("breadcrumb", () => {
  it("should turn a trail of pages into a positioned, absolute list", () => {
    expect(
      breadcrumb([
        { name: "Accueil", path: "/" },
        { name: "Nos concerts", path: "/nos-concerts" },
        { name: "Concert de Noël", path: "/nos-concerts/concert-de-noel" },
      ])
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://choeurdespaysdumontblanc.fr/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Nos concerts",
          item: "https://choeurdespaysdumontblanc.fr/nos-concerts",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Concert de Noël",
          item: "https://choeurdespaysdumontblanc.fr/nos-concerts/concert-de-noel",
        },
      ],
    });
  });
});

describe("concertList", () => {
  it("should list every performance of every given concert as an event", () => {
    const twoNights = concertOf("concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais");
    const oneNight = concertOf("concert-de-noel-22-decembre-2024-gaillard");

    const list = concertList([twoNights, oneNight]);

    expect(list["@type"]).toBe("ItemList");
    expect(list.itemListElement).toHaveLength(concertEvents(twoNights).length + concertEvents(oneNight).length);
    expect(list.itemListElement.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(list.itemListElement[0].item).toMatchObject({ "@type": "MusicEvent", name: twoNights.title });
  });

  it("should describe an empty agenda as an empty list", () => {
    expect(concertList([]).itemListElement).toEqual([]);
  });
});

describe("pressArticle", () => {
  const base = {
    title: "Un concert salué par le public",
    slug: "un-concert-salue-par-le-public",
    publication: "Le Dauphiné Libéré, Décembre 2026",
    subtitle: "Article paru dans le Dauphiné Libéré.",
    media: [{ url: "/articles/un-concert-salue-par-le-public.jpg", alt: "Coupure de presse" }],
  };

  it("should publish the day when the paper gives it", () => {
    expect(pressArticle({ ...base, date: "2026-12-13" })).toMatchObject({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: base.title,
      url: "https://choeurdespaysdumontblanc.fr/presse/un-concert-salue-par-le-public",
      datePublished: "2026-12-13",
      description: base.subtitle,
      image: "https://choeurdespaysdumontblanc.fr/articles/un-concert-salue-par-le-public.jpg",
      author: { "@type": "Organization", name: "Le Dauphiné Libéré" },
    });
  });

  it("should leave datePublished out rather than invent a day the paper never printed", () => {
    expect(pressArticle({ ...base, date: "2026-12" })).not.toHaveProperty("datePublished");
  });

  it("should leave image and author out when the data carries neither", () => {
    const bare = { ...base, publication: undefined, media: [], date: "2026-12-13" };

    const article = pressArticle(bare);

    expect(article).not.toHaveProperty("image");
    expect(article).not.toHaveProperty("author");
  });
});

describe("personSchema", () => {
  it("should describe an interpreter as a person, a member of the choir", () => {
    const artist = {
      name: "Benoît Dubu",
      media: "/media/benoit_dubu.jpg",
      text: ["Benoît Dubu découvre le chant choral dès son plus jeune âge."],
    };

    expect(personSchema("benoit-dubu", artist)).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Benoît Dubu",
      image: "https://choeurdespaysdumontblanc.fr/media/benoit_dubu.jpg",
      url: "https://choeurdespaysdumontblanc.fr/presentation/benoit-dubu",
      memberOf: {
        "@type": "MusicGroup",
        name: "Chœur des Pays du Mont-Blanc",
        url: "https://choeurdespaysdumontblanc.fr",
      },
      description: artist.text[0],
    });
  });

  it("should carry no description when the artist has no text", () => {
    const artist = { name: "Interprète", media: "/media/x.jpg", text: [] };

    expect(personSchema("interprete", artist)).not.toHaveProperty("description");
  });
});
