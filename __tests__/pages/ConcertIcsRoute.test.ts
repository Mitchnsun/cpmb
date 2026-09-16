import { generateStaticParams, GET } from "@/app/nos-concerts/[slug]/concert.ics/route";
import concerts from "@/assets/contents/concerts.json";

/** The concert given twice in June 2025: two performances in one file. */
const GLORIA = concerts.find((c) => c.slug === "concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais")!;

const get = (slug: string) =>
  GET(new Request("https://choeurdespaysdumontblanc.fr"), { params: Promise.resolve({ slug }) });

describe("concert.ics route", () => {
  it("should prerender one file per concert", async () => {
    const params = await generateStaticParams();

    expect(params).toHaveLength(concerts.length);
  });

  it("should serve the file as a calendar, named after the concert", async () => {
    const response = await get(GLORIA.slug);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/calendar; charset=utf-8");
    expect(response.headers.get("Content-Disposition")).toBe(`attachment; filename="${GLORIA.slug}.ics"`);
  });

  it("should carry one event per performance, with the link to the concert page", async () => {
    const body = await (await get(GLORIA.slug)).text();
    /* Long values are folded over several lines: read them back whole. */
    const unfolded = body.replaceAll("\r\n ", "");

    expect(body.match(/BEGIN:VEVENT/g)).toHaveLength(GLORIA.date.length);
    expect(unfolded).toContain(`URL:https://choeurdespaysdumontblanc.fr/nos-concerts/${GLORIA.slug}`);
    expect(unfolded).toContain("SUMMARY:Concert Vivaldi Jenkins");
  });

  it("should answer 404 for a slug that names no concert", async () => {
    expect((await get("pas-un-concert")).status).toBe(404);
  });
});
