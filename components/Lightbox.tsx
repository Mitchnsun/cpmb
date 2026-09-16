"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { type RefObject } from "react";

import { type SiteImage } from "@/assets/contents/medias";
import CloseIcon from "@/assets/icons/close.svg";

interface LightboxProps {
  /** The photo to show full size, or `null` when the lightbox is closed. */
  image: SiteImage | null;
  onClose: () => void;
  /**
   * What opened it. Being driven by a prop rather than a `Dialog.Trigger`,
   * Radix has nothing to hand focus back to on its own, and a keyboard
   * visitor would land on `<body>` — back at the top of the document.
   */
  returnFocusTo?: RefObject<HTMLElement | null>;
}

/**
 * A photo shown at full size over the page.
 *
 * Radix owns the hard parts — focus trap, restoring focus to the thumbnail
 * on close, Escape, and marking the rest of the page inert — so this only
 * describes what the layer looks like. The photo is capped at the viewport
 * rather than stretched: several of the gallery files are 4.2:1 strips, and
 * blowing one up past its own pixels would only soften it.
 *
 * The dark margin around the photo closes it, as a viewer is expected to,
 * and closing returns focus to `returnFocusTo`. The layer's title stays
 * generic: the photo is described once, by the image it belongs to.
 */
const Lightbox = ({ image, onClose, returnFocusTo }: LightboxProps) => (
  <Dialog.Root open={image !== null} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-stage-black/95 fixed inset-0 z-50" />
      <Dialog.Content
        aria-describedby={undefined}
        /* Radix treats the whole layer as "inside", so a click on the dark
           margin would not close it: only a hit on the backdrop itself, not
           on the photo or the close button, counts. */
        onClick={(event) => event.target === event.currentTarget && onClose()}
        onCloseAutoFocus={(event) => {
          if (!returnFocusTo?.current) return;
          event.preventDefault();
          returnFocusTo.current.focus();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 focus:outline-none"
      >
        {/* Generic on purpose. The image's own `alt` describes the photo, and
            the slide that opened the layer already named it: titling the
            dialog with that same text made a screen reader say it three times
            over — dialog, heading, image. The title says what the layer is. */}
        <Dialog.Title className="sr-only">Photo agrandie</Dialog.Title>

        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="100vw"
            className="max-h-full w-auto max-w-full rounded-sm object-contain"
          />
        ) : null}

        <Dialog.Close
          aria-label="Fermer l'image"
          className="text-text-on-dark hover:bg-stage-surface hover:text-teal-light focus-visible:outline-teal-light absolute top-6 right-6 flex min-h-12 min-w-12 items-center justify-center rounded-lg focus-visible:outline-2"
        >
          <CloseIcon aria-hidden="true" className="h-6 w-6" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Lightbox;
