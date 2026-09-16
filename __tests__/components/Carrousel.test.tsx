import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { CARROUSEL_IMAGES } from "@/assets/contents/carrousel";
import Carrousel from "@/components/Carrousel";

describe("Carrousel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const user = userEvent.setup();

  it("should render every photo of the gallery", () => {
    const { container } = render(<Carrousel />);

    expect(screen.getByRole("region", { name: "Photos du chœur" })).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(CARROUSEL_IMAGES.length);
  });

  it("should reserve the same box for every slide, whatever the photo's shape", () => {
    const { container } = render(<Carrousel />);

    // The files range from 1.51 to 4.2 in ratio: the frame is fixed and the
    // photo is contained inside it, so nothing is cropped and nothing jumps.
    expect(container.querySelector(".aspect-\\[21\\/9\\]")).toBeInTheDocument();
    container.querySelectorAll("img").forEach((image) => {
      expect(image).toHaveClass("object-contain");
    });
  });

  it("should name each slide once, as a control that enlarges the photo", () => {
    render(<Carrousel />);

    // Only the slide on screen is in the accessibility tree, and the image
    // inside it is decorative: naming both would announce the photo twice.
    const slides = screen.getAllByRole("button", { name: /^Agrandir la photo/ });
    expect(slides).toHaveLength(1);
    expect(slides[0]).toHaveAccessibleName(`Agrandir la photo : ${CARROUSEL_IMAGES[0].alt}`);
  });

  it("should keep the off-screen slides out of the tab order", () => {
    const { container } = render(<Carrousel />);

    const slides = [...container.querySelectorAll('button[aria-label^="Agrandir la photo"]')];
    expect(slides).toHaveLength(CARROUSEL_IMAGES.length);
    expect(slides[0]).not.toHaveAttribute("tabindex");
    slides.slice(1).forEach((slide) => {
      expect(slide).toHaveAttribute("tabindex", "-1");
      expect(slide).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("should offer the arrows, the pause and one dot per photo", () => {
    render(<Carrousel />);

    expect(screen.getByRole("button", { name: "Photo précédente" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Photo suivante" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mettre le défilement en pause" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Photo \d+ sur 6/ })).toHaveLength(CARROUSEL_IMAGES.length);
  });

  it("should say which photo a dot leads to, not just its rank", () => {
    render(<Carrousel />);

    expect(screen.getByRole("button", { name: `Photo 1 sur 6 : ${CARROUSEL_IMAGES[0].alt}` })).toHaveAttribute(
      "aria-current",
      "true"
    );
  });

  it("should move to the next photo and hand control to the visitor", async () => {
    render(<Carrousel />);

    await user.click(screen.getByRole("button", { name: "Photo suivante" }));

    expect(screen.getByRole("button", { name: `Photo 2 sur 6 : ${CARROUSEL_IMAGES[1].alt}` })).toHaveAttribute(
      "aria-current",
      "true"
    );
    // Taking control stops the slideshow, so it never moves under the reader.
    expect(screen.getByRole("button", { name: "Reprendre le défilement" })).toBeInTheDocument();
  });

  it("should wrap around from the first photo to the last", async () => {
    render(<Carrousel />);

    await user.click(screen.getByRole("button", { name: "Photo précédente" }));

    const last = CARROUSEL_IMAGES.length;
    expect(
      screen.getByRole("button", { name: `Photo ${last} sur 6 : ${CARROUSEL_IMAGES[last - 1].alt}` })
    ).toHaveAttribute("aria-current", "true");
  });

  it("should open the photo full size when a slide is clicked", async () => {
    render(<Carrousel />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Agrandir la photo/ }));

    expect(screen.getByRole("dialog", { name: CARROUSEL_IMAGES[0].alt })).toBeInTheDocument();
  });

  it("should keep the dots and the pause out of the photo frame", () => {
    const { container } = render(<Carrousel />);

    // A 21/9 frame is barely 117px tall on a 320px screen: a centred arrow
    // and a corner control cannot both have a 44px target inside it.
    const frame = container.querySelector(".aspect-\\[21\\/9\\]") as HTMLElement;
    expect(frame.querySelector('[aria-label^="Photo 1 sur"]')).toBeNull();
    expect(frame.querySelector('[aria-label^="Mettre le défilement"]')).toBeNull();

    // The arrows stay on the photo, at its sides, where nothing competes.
    expect(frame.querySelector('[aria-label="Photo précédente"]')).toBeInTheDocument();
    expect(frame.querySelector('[aria-label="Photo suivante"]')).toBeInTheDocument();
  });

  it("should announce politely only once the slideshow is stopped", () => {
    const { rerender } = render(<Carrousel />);

    expect(screen.getByRole("region")).toHaveAttribute("aria-live", "off");

    rerender(<Carrousel autoplay={false} />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-live", "polite");
  });
});
