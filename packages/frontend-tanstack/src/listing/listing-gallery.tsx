import type { ListingImage } from "@remix-v3-demo/domain/listing/model";
import type { ReactNode } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

import { ListingImagePlaceholder } from "./listing-image-placeholder.tsx";
import { ListingPhoto } from "./listing-photo.tsx";

const SLIDE_CLASS_NAME = "aspect-[4/3] max-h-[70svh] w-full md:aspect-[16/9]";

export function ListingGallery({ images }: { images: ListingImage[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <ListingImagePlaceholder
        className={`${SLIDE_CLASS_NAME} border-obsidian-700 border`}
      />
    );
  }

  const goTo = (nextIndex: number) => {
    const track = trackRef.current;
    track?.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-roledescription="carrousel"
      aria-label="Photos du bien"
      className="border-obsidian-700 bg-obsidian-950 relative border"
    >
      <ul
        ref={trackRef}
        onScroll={(event) =>
          setIndex(
            Math.round(
              event.currentTarget.scrollLeft / event.currentTarget.clientWidth,
            ),
          )
        }
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto"
      >
        {images.map((image, imageIndex) => (
          <li
            key={image.url}
            aria-roledescription="diapositive"
            aria-label={`${imageIndex + 1} sur ${images.length}`}
            className="w-full shrink-0 snap-start"
          >
            <ListingPhoto
              image={image}
              className={SLIDE_CLASS_NAME}
              isPriority={imageIndex === 0}
            />
          </li>
        ))}
      </ul>
      {images.length > 1 && (
        <>
          <SlideButton
            label="Photo précédente"
            isDisabled={index === 0}
            onClick={() => goTo(index - 1)}
            className="left-3"
            icon={
              <ChevronLeft
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.5}
              />
            }
          />
          <SlideButton
            label="Photo suivante"
            isDisabled={index === images.length - 1}
            onClick={() => goTo(index + 1)}
            className="right-3"
            icon={
              <ChevronRight
                aria-hidden="true"
                className="size-5"
                strokeWidth={1.5}
              />
            }
          />
          <p
            aria-live="polite"
            className="eyebrow border-obsidian-700 bg-obsidian-950/85 absolute right-3 bottom-3 border px-3 py-1"
          >
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </section>
  );
}

function SlideButton({
  label,
  isDisabled,
  onClick,
  className,
  icon,
}: {
  label: string;
  isDisabled: boolean;
  onClick: () => void;
  className: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={isDisabled}
      onClick={onClick}
      className={`border-gold bg-obsidian-950/85 text-gold hover:bg-gold hover:text-obsidian-950 focus-visible:outline-gold absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:invisible ${className}`}
    >
      {icon}
    </button>
  );
}
