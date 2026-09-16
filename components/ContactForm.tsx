"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import { buttonLinkVariants } from "@/components/ButtonLink";
import FormField, { type FieldOption } from "@/components/FormField";
import InfoPanel from "@/components/InfoPanel";
import TextLink from "@/components/TextLink";
import { cn } from "@/utils/classnames";
import { CONTACT_EMAIL } from "@/utils/site";

/**
 * Subjects of the form. The values double as the `?objet=` parameter, so a
 * link can land on the page with the subject already chosen — that is how
 * the home page's "Nous rejoindre" banner arrives.
 */
const SUBJECTS: readonly FieldOption[] = [
  { value: "rejoindre", label: "Rejoindre le chœur" },
  { value: "concerts", label: "Question sur les concerts" },
  { value: "invitation", label: "Inviter le chœur" },
  { value: "autre", label: "Autre" },
];

const MIN_MESSAGE_LENGTH = 10;

/** Nobody fills four fields in under two seconds; a script does. */
const MIN_FILL_TIME_MS = 2000;

const FIELD_IDS = {
  name: "contact-name",
  email: "contact-email",
  subject: "contact-subject",
  message: "contact-message",
} as const;

type Field = keyof typeof FIELD_IDS;
type FormValues = Record<Field, string>;
type FormErrors = Partial<Record<Field, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email, subject, message }: FormValues): FormErrors => {
  const errors: FormErrors = {};

  if (!name.trim()) errors.name = "Le nom est requis";

  if (!email.trim()) {
    errors.email = "L'adresse e-mail est requise";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Veuillez saisir une adresse e-mail valide";
  }

  if (!subject) errors.subject = "L'objet est requis";

  if (!message.trim()) {
    errors.message = "Le message est requis";
  } else if (message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Le message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères`;
  }

  return errors;
};

/** `mailto:` draft: the subject carries the chosen topic, then the sender. */
const mailtoHref = ({ name, email, subject, message }: FormValues): string => {
  const topic = SUBJECTS.find((option) => option.value === subject)?.label ?? "";
  const mailSubject = encodeURIComponent(`${topic} — ${name}`);
  const body = encodeURIComponent(`Nom : ${name}\nE-mail : ${email}\n\nMessage :\n${message}`);

  return `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${body}`;
};

/**
 * Contact form (CPMB-15).
 *
 * The site has no backend, so a valid submission opens the visitor's mail
 * client on a prefilled draft — the confirmation says so rather than
 * claiming an send that did not happen. Validation therefore runs in the
 * browser only; the server-side pass the ticket asks for is tracked
 * separately, and so is the delivery that would go with it.
 *
 * Accessibility: the label sits above every control and no placeholder ever
 * stands in for one, each error is tied to its field by `aria-describedby`,
 * and the whole list is repeated in a polite live region so a screen reader
 * hears what failed without having to walk the form again.
 */
const ContactForm = () => {
  // On a statically prerendered page, `useSearchParams` renders this subtree
  // on the client down from the `<Suspense>` boundary of `app/contact`, so
  // the preselected subject can safely seed the initial state.
  const searchParams = useSearchParams();
  const requestedSubject = searchParams.get("objet") ?? "";
  const presetSubject = SUBJECTS.some((option) => option.value === requestedSubject) ? requestedSubject : "";

  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    subject: presetSubject,
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* Trap: hidden from sight, from the tab order and from screen readers, so
     only a script filling every input it finds will touch it. */
  const [trap, setTrap] = useState("");

  /* Set after mount, never at render: the value must not reach the HTML. */
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isSubmitted) confirmation.current?.focus();
  }, [isSubmitted]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formErrors = validate(values);
    setErrors(formErrors);
    setFormError(undefined);

    if (Object.keys(formErrors).length > 0) return;

    /* Dropped without a word: a bot learns nothing from a silent success. */
    if (trap) {
      setIsSubmitted(true);
      return;
    }

    if (Date.now() - renderedAt.current < MIN_FILL_TIME_MS) {
      setFormError("Votre message est parti trop vite pour être pris en compte. Merci de renvoyer le formulaire.");
      return;
    }

    /* The values stay in state: nothing is lost if the draft never opens. */
    window.location.href = mailtoHref(values);
    setIsSubmitted(true);
  };

  const handleChange = (field: Field) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  if (isSubmitted) {
    return (
      <InfoPanel ref={confirmation} tabIndex={-1} className="p-7">
        <p className="font-display text-2xl">Votre message est prêt à être envoyé.</p>
        <p className="text-muted mt-3 text-lg">
          Votre logiciel de messagerie s&apos;est ouvert sur un brouillon : il ne reste qu&apos;à l&apos;envoyer. Le
          bureau du chœur vous répondra à l&apos;adresse indiquée. Merci de votre intérêt.
        </p>
        <p className="text-muted mt-3 text-lg">
          Si rien ne s&apos;est ouvert, écrivez-nous directement à{" "}
          <TextLink href={`mailto:${CONTACT_EMAIL}`} className="wrap-anywhere">
            {CONTACT_EMAIL}
          </TextLink>
          .
        </p>
      </InfoPanel>
    );
  }

  const summary = (Object.keys(FIELD_IDS) as Field[])
    .filter((field) => errors[field])
    .map((field) => ({ field, id: FIELD_IDS[field], message: errors[field] as string }));

  return (
    <>
      {/* Outside the form's grid, and in the DOM from the start: a live
          region only announces what appears in it once rendered, and an
          empty grid cell would still open a gap above the first field. */}
      <div aria-live="polite">
        {summary.length > 0 ? (
          <InfoPanel accent="copper" className="mb-5.5">
            <p className="text-lg font-semibold">
              {summary.length > 1
                ? `${summary.length} champs sont à corriger avant l'envoi :`
                : "Un champ est à corriger avant l'envoi :"}
            </p>
            <ul className="mt-2 grid gap-1.5">
              {summary.map(({ field, id, message }) => (
                <li key={field} className="text-lg">
                  <TextLink href={`#${id}`}>{message}</TextLink>
                </li>
              ))}
            </ul>
          </InfoPanel>
        ) : null}

        {formError ? (
          <InfoPanel accent="copper" className="mb-5.5">
            <p className="text-lg">{formError}</p>
          </InfoPanel>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5.5" noValidate>
        <FormField
          id={FIELD_IDS.name}
          label="Nom"
          value={values.name}
          onChange={handleChange("name")}
          error={errors.name}
          autoComplete="name"
        />

        <FormField
          id={FIELD_IDS.email}
          label="Adresse e-mail"
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          error={errors.email}
          autoComplete="email"
        />

        <FormField
          id={FIELD_IDS.subject}
          label="Objet"
          value={values.subject}
          onChange={handleChange("subject")}
          error={errors.subject}
          options={SUBJECTS}
          emptyOption="Choisissez un objet"
        />

        <FormField
          id={FIELD_IDS.message}
          label="Message"
          rows={6}
          value={values.message}
          onChange={handleChange("message")}
          error={errors.message}
        />

        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-site">Ne remplissez pas ce champ</label>
          <input
            id="contact-site"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className={cn(buttonLinkVariants(), "cursor-pointer px-6.5")}>
            Envoyer le message
          </button>
          <p className="text-muted text-base">Les champs marqués « obligatoire » sont requis.</p>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
