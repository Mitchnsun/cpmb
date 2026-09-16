import InfoPanel from "@/components/InfoPanel";
import TextLink from "@/components/TextLink";
import { CONTACT_EMAIL, REHEARSAL_PLACE } from "@/utils/site";

/**
 * "Informations pratiques" column of the contact page (CPMB-15): how to
 * reach the choir, why one would, and where it rehearses.
 *
 * The rehearsals panel carries the copper accent — it is background, not the
 * action the page is asking for; that one is the form, on the other column.
 */
const ContactInfo = () => (
  <div>
    <h2 className="font-display mb-5.5 text-3xl font-semibold">Informations pratiques</h2>

    <h3 className="mb-1.5 text-lg font-semibold">Adresse e-mail</h3>
    <p className="mb-7 text-lg">
      <TextLink touch href={`mailto:${CONTACT_EMAIL}`} className="wrap-anywhere">
        {CONTACT_EMAIL}
      </TextLink>
    </p>

    <h3 className="mb-1.5 text-lg font-semibold">Rejoignez-nous</h3>
    <p className="text-muted mb-7 text-lg">
      Nous recrutons des choristes ayant une expérience chorale et/ou une capacité en déchiffrage. N&apos;hésitez pas à
      nous contacter pour plus d&apos;informations !
    </p>

    <InfoPanel accent="copper">
      <h3 className="mb-1.5 text-lg font-semibold">Répétitions</h3>
      <p className="text-muted text-lg">
        {REHEARSAL_PLACE.name} — {REHEARSAL_PLACE.locality} ({REHEARSAL_PLACE.postalCode})
        <br />
        Un vendredi par mois, 19h30 – 22h
        <br />
        Un dimanche par mois, 10h – 16h
      </p>
    </InfoPanel>
  </div>
);

export default ContactInfo;
