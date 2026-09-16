import type { Metadata } from "next";
import { Suspense } from "react";

import { CONTACT_BANNER } from "@/assets/contents/medias";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Contact – Chœur des Pays du Mont-Blanc",
  description: "Contactez-nous pour rejoindre le Chœur des Pays du Mont-Blanc ou pour toute information.",
};

/**
 * "Contact" page (CPMB-15): the banner, then the practical information and
 * the form side by side — a fluid two-column grid that falls to one column
 * on its own, with no media query.
 */
export default function Contact() {
  return (
    <>
      <PageBanner overline="Écrire au chœur" title="Contact" image={CONTACT_BANNER} />

      <section className="max-w-site mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-14 px-6 pt-16 pb-20">
        <ContactInfo />

        <div>
          <h2 className="font-display mb-5.5 text-3xl font-semibold">Envoyez-nous un message</h2>
          {/* `useSearchParams` reads `?objet=` to preselect the subject: on a
              statically prerendered page it needs a boundary above it. */}
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
