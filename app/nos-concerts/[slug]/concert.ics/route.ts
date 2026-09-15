import concerts from "@/assets/contents/concerts.json";
import { type Concert } from "@/utils/concerts";
import { buildConcertIcs, CALENDAR_CONTENT_TYPE, icsFileName } from "@/utils/ics";
import { concertUrl } from "@/utils/site";

/**
 * Calendar file of a concert, at `/nos-concerts/<slug>/concert.ics`
 * (CPMB-12). Prerendered like every page of the site: the route is built
 * once for each concert, and served as a static file afterwards.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return concerts.map((concert: Concert) => ({ slug: concert.slug }));
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const concert = concerts.find((item: Concert) => item.slug === slug);

  if (!concert) {
    return new Response("Concert introuvable", { status: 404 });
  }

  /* Prerendered at build time: this stamp is the export's, not a visitor's. */

  const body = buildConcertIcs(concert, { url: concertUrl(slug), now: Date.now() });

  return new Response(body, {
    headers: {
      "Content-Type": CALENDAR_CONTENT_TYPE,
      "Content-Disposition": `attachment; filename="${icsFileName(slug)}"`,
    },
  });
}
