import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { type SiteImage } from "@/assets/contents/medias";
import Lightbox from "@/components/Lightbox";

const photo: SiteImage = {
  src: "/carrousel/CPMB2.jpg",
  alt: "Le chœur en concert, écharpes turquoise",
  width: 2512,
  height: 1669,
};

describe("Lightbox", () => {
  const user = userEvent.setup();

  it("should render nothing while no photo is chosen", () => {
    render(<Lightbox image={null} onClose={vi.fn()} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should name the layer with the photo's own description", () => {
    render(<Lightbox image={photo} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog", { name: photo.alt })).toBeInTheDocument();
  });

  it("should show the photo whole, at its native dimensions", () => {
    render(<Lightbox image={photo} onClose={vi.fn()} />);

    const image = screen.getByAltText(photo.alt);
    expect(image).toHaveAttribute("width", String(photo.width));
    expect(image).toHaveAttribute("height", String(photo.height));
    expect(image).toHaveClass("object-contain", "max-h-full", "max-w-full");
  });

  it("should close on the close button", async () => {
    const onClose = vi.fn();
    render(<Lightbox image={photo} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Fermer l'image" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("should close on Escape", async () => {
    const onClose = vi.fn();
    render(<Lightbox image={photo} onClose={onClose} />);

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });

  it("should close on the dark margin, but not on the photo itself", async () => {
    const onClose = vi.fn();
    render(<Lightbox image={photo} onClose={onClose} />);

    await user.click(screen.getByAltText(photo.alt));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });
});
