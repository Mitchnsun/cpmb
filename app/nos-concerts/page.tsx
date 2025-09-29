import concerts from "@/assets/contents/concerts.json";
import Concert from "@/components/Concert";
import Heading from "@/components/Heading";

export default function NosConcerts() {
  const now = Date.now();

  const parsed = concerts.map((c) => {
    const times = c.date.map((d) => new Date(d).getTime()).filter((t) => Number.isFinite(t));
    const nextUpcoming = times.filter((t) => t >= now).sort((a, b) => a - b)[0];
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    return { data: c, times, minTime, maxTime, nextUpcoming } as const;
  });

  const upcoming = parsed
    .filter((c) => c.times.some((t) => t >= now))
    .sort((a, b) => (a.nextUpcoming ?? Infinity) - (b.nextUpcoming ?? Infinity));

  const past = parsed.filter((c) => c.times.every((t) => t < now)).sort((a, b) => b.maxTime - a.maxTime);

  return (
    <section className="container mx-auto mt-2 p-4">
      <section>
        <Heading hLevel={1} variant={0} className="mb-8 border-b-2 border-sky-700 pb-2 text-2xl lg:w-1/2">
          Nos prochains concerts
        </Heading>
        <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {upcoming.length > 0 ? (
            upcoming.map(({ data }) => (
              <li key={data.slug}>
                <Concert {...data} />
              </li>
            ))
          ) : (
            <li aria-live="polite">Les concerts de cette saison vont être annoncés prochainement</li>
          )}
        </ul>
      </section>
      <section className="mt-10">
        <Heading hLevel={2} variant={0} className="mb-8 border-b-2 border-sky-700 pb-2 text-2xl lg:w-1/2">
          Nos concerts passés
        </Heading>
        <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {past.map(({ data }) => (
            <li key={data.slug}>
              <Concert {...data} />
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
