import concerts from "@/assets/contents/concerts.json";
import Concert from "@/components/Concert";
import Heading from "@/components/Heading";
import { splitConcertsByDate } from "@/utils/concerts";

export default function NosConcerts() {
  // The page is statically prerendered, so the reference date is the build
  // date, not the visit date — a concert only moves to "past" on the next
  // deploy. CPMB-11 will decide between dynamic rendering and revalidation;
  // the rule is disabled here knowingly, since `Date.now()` is indeed impure.
  // eslint-disable-next-line react-hooks/purity
  const { upcoming, past } = splitConcertsByDate(concerts, Date.now());

  return (
    <section className="container mx-auto mt-2 p-4">
      <section>
        <Heading hLevel={1} variant={0} className="mb-8 border-b-2 border-sky-700 pb-2 text-2xl lg:w-1/2">
          Nos prochains concerts
        </Heading>
        <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {upcoming.length > 0 ? (
            upcoming.map((data) => (
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
          {past.map((data) => (
            <li key={data.slug}>
              <Concert {...data} />
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
