import { concertIcsPath, concertPath, concertUrl, SITE_URL } from "@/utils/site";

describe("site", () => {
  it("should build the path of a concert page", () => {
    expect(concertPath("concert-de-noel")).toBe("/nos-concerts/concert-de-noel");
  });

  it("should build the absolute address of a concert page", () => {
    expect(concertUrl("concert-de-noel")).toBe(`${SITE_URL}/nos-concerts/concert-de-noel`);
  });

  it("should place the calendar file next to the concert page", () => {
    expect(concertIcsPath("concert-de-noel")).toBe("/nos-concerts/concert-de-noel/concert.ics");
  });
});
