import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { vi } from "vitest";

import ContactForm from "@/components/ContactForm";

const mockLocationHref = vi.fn();
Object.defineProperty(window, "location", {
  value: {
    get href() {
      return "";
    },
    set href(url: string) {
      mockLocationHref(url);
    },
  },
  writable: true,
});

/* Fake timers deadlock `userEvent`, so the clock is moved by hand: the
   component only ever reads `Date.now()`. */
let now = 1_700_000_000_000;
const waitOutTheAntiSpamDelay = () => {
  now += 2500;
};

const useControlledClock = () => {
  let clock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    now = 1_700_000_000_000;
    clock = vi.spyOn(Date, "now").mockImplementation(() => now);
  });

  afterEach(() => {
    clock.mockRestore();
  });
};

const fillTheForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/^Nom/), "Marie Dupont");
  await user.type(screen.getByLabelText(/^Adresse e-mail/), "marie@example.com");
  await user.selectOptions(screen.getByLabelText(/^Objet/), "concerts");
  await user.type(screen.getByLabelText(/^Message/), "Bonjour, je souhaite des informations sur vos concerts.");
};

const submit = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Envoyer le message" }));

/* Every message shows twice on purpose — under its field and in the summary
   — so a field error is read back through the id the control points at. */
const fieldError = (field: string) => document.getElementById(`contact-${field}-error`);

describe("ContactForm", () => {
  useControlledClock();
  const user = userEvent.setup();

  it("should render every field with a visible label and no placeholder standing in for one", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^Nom/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Adresse e-mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Objet/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Message/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Envoyer le message" })).toBeInTheDocument();

    expect(document.querySelectorAll("[placeholder]")).toHaveLength(0);
  });

  it("should say which fields are required with the word, not an asterisk", () => {
    render(<ContactForm />);

    expect(screen.getAllByText("(obligatoire)")).toHaveLength(4);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("should offer the four subjects of the ticket", () => {
    render(<ContactForm />);

    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual([
      "Choisissez un objet",
      "Rejoindre le chœur",
      "Question sur les concerts",
      "Inviter le chœur",
      "Autre",
    ]);
  });

  it("should report every empty required field", async () => {
    render(<ContactForm />);

    await submit(user);

    expect(fieldError("name")).toHaveTextContent("Le nom est requis");
    expect(fieldError("email")).toHaveTextContent("L'adresse e-mail est requise");
    expect(fieldError("subject")).toHaveTextContent("L'objet est requis");
    expect(fieldError("message")).toHaveTextContent("Le message est requis");
    expect(mockLocationHref).not.toHaveBeenCalled();
  });

  it("should repeat the errors in a polite live region, one link per field", async () => {
    const { container } = render(<ContactForm />);

    await submit(user);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent("4 champs sont à corriger avant l'envoi :");

    const summaryLinks = screen.getAllByRole("link");
    expect(summaryLinks.map((link) => link.getAttribute("href"))).toEqual([
      "#contact-name",
      "#contact-email",
      "#contact-subject",
      "#contact-message",
    ]);
  });

  it("should switch the summary to the singular for a single error", async () => {
    const { container } = render(<ContactForm />);

    await fillTheForm(user);
    await user.clear(screen.getByLabelText(/^Nom/));
    await submit(user);

    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(
      "Un champ est à corriger avant l'envoi :"
    );
  });

  it("should reject a malformed e-mail address", async () => {
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^Adresse e-mail/), "pas-une-adresse");
    await submit(user);

    expect(fieldError("email")).toHaveTextContent("Veuillez saisir une adresse e-mail valide");
  });

  it("should reject a message shorter than ten characters", async () => {
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^Message/), "court");
    await submit(user);

    expect(fieldError("message")).toHaveTextContent("Le message doit contenir au moins 10 caractères");
  });

  it("should tie each error to its field, and clear it as soon as the visitor types", async () => {
    render(<ContactForm />);

    await submit(user);

    const nameInput = screen.getByLabelText(/^Nom/);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby", "contact-name-error");
    expect(fieldError("name")).toHaveTextContent("Le nom est requis");

    await user.type(nameInput, "M");

    expect(fieldError("name")).not.toBeInTheDocument();
    expect(screen.queryByText("Le nom est requis")).not.toBeInTheDocument();
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
    expect(nameInput).not.toHaveAttribute("aria-describedby");
  });

  it("should open a prefilled draft and confirm, on a valid submission", async () => {
    render(<ContactForm />);

    await fillTheForm(user);
    await waitOutTheAntiSpamDelay();
    await submit(user);

    const mailto = mockLocationHref.mock.calls[0][0];
    expect(mailto).toContain("mailto:bureau@choeurdespaysdumontblanc.fr");
    expect(mailto).toContain(encodeURIComponent("Question sur les concerts — Marie Dupont"));
    expect(mailto).toContain(encodeURIComponent("marie@example.com"));

    expect(screen.getByText("Votre message est prêt à être envoyé.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Envoyer le message" })).not.toBeInTheDocument();
  });

  it("should move the focus to the confirmation panel", async () => {
    render(<ContactForm />);

    await fillTheForm(user);
    await waitOutTheAntiSpamDelay();
    await submit(user);

    const confirmation = screen.getByText("Votre message est prêt à être envoyé.").closest("div");
    expect(confirmation).toHaveAttribute("tabindex", "-1");
    await waitFor(() => expect(confirmation).toHaveFocus());
  });

  it("should percent-encode accents and ampersands in the draft", async () => {
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^Nom/), "Jean-Luc & Marie");
    await user.type(screen.getByLabelText(/^Adresse e-mail/), "test@example.com");
    await user.selectOptions(screen.getByLabelText(/^Objet/), "autre");
    await user.type(screen.getByLabelText(/^Message/), "Message avec caractères spéciaux : é, è, à, ç");
    await waitOutTheAntiSpamDelay();
    await submit(user);

    const mailto = mockLocationHref.mock.calls[0][0];
    expect(mailto).toContain("Jean-Luc%20%26%20Marie");
    expect(mailto).toContain("caract%C3%A8res");
  });
});

describe("ContactForm anti-spam", () => {
  useControlledClock();
  const user = userEvent.setup();

  it("should refuse a submission sent faster than a human could fill the form", async () => {
    render(<ContactForm />);

    await fillTheForm(user);
    await submit(user);

    expect(mockLocationHref).not.toHaveBeenCalled();
    expect(
      screen.getByText("Votre message est parti trop vite pour être pris en compte. Merci de renvoyer le formulaire.")
    ).toBeInTheDocument();
  });

  it("should keep the typed values when a submission is refused", async () => {
    render(<ContactForm />);

    await fillTheForm(user);
    await submit(user);

    expect(screen.getByLabelText(/^Nom/)).toHaveValue("Marie Dupont");
    expect(screen.getByLabelText(/^Adresse e-mail/)).toHaveValue("marie@example.com");
    expect(screen.getByLabelText(/^Objet/)).toHaveValue("concerts");
  });

  it("should drop a submission that filled the hidden trap, without saying so", async () => {
    const { container } = render(<ContactForm />);

    await fillTheForm(user);
    const trap = container.querySelector("#contact-site") as HTMLInputElement;
    expect(trap).toHaveAttribute("tabindex", "-1");
    await user.type(trap, "https://spam.example");
    await waitOutTheAntiSpamDelay();
    await submit(user);

    expect(mockLocationHref).not.toHaveBeenCalled();
    expect(screen.getByText("Votre message est prêt à être envoyé.")).toBeInTheDocument();
  });
});

describe("ContactForm subject preselection", () => {
  it("should preselect the subject carried by ?objet=", () => {
    vi.mocked(useSearchParams).mockReturnValueOnce(new URLSearchParams("objet=rejoindre") as never);

    render(<ContactForm />);

    expect(screen.getByLabelText(/^Objet/)).toHaveValue("rejoindre");
  });

  it("should leave the subject unchosen for an unknown parameter", () => {
    vi.mocked(useSearchParams).mockReturnValueOnce(new URLSearchParams("objet=inconnu") as never);

    render(<ContactForm />);

    expect(screen.getByLabelText(/^Objet/)).toHaveValue("");
  });

  it("should leave the subject unchosen when there is no parameter at all", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/^Objet/)).toHaveValue("");
  });
});
