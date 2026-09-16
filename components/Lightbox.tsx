"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";

import { type SiteImage } from "@/assets/contents/medias";
import CloseIcon from "@/assets/icons/close.svg";

interface LightboxProps {
  /** The photo to show full size, or `null` when the lightbox is closed. */
  image: SiteImage | null;
  onClose: () => void;
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
 * The dark margin around the photo closes it, as a viewer is expected to.
 */
const Lightbox = ({ image, onClose }: LightboxProps) => (
  <Dialog.Root open={image !== null} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="bg-stage-black/95 fixed inset-0 z-50" />
      <Dialog.Content
        aria-describedby={undefined}
        /* Radix treats the whole layer as "inside", so a click on the dark
           margin would not close it: only a hit on the backdrop itself, not
           on the photo or the close button, counts. */
        onClick={(event) => event.target === event.currentTarget && onClose()}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 focus:outline-none"
      >
        {/* The alt already describes the photo: the title names the layer. */}
        <Dialog.Title className="sr-only">{image?.alt}</Dialog.Title>

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
