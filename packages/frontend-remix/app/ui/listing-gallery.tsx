import type { ListingImage } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { ChevronLeft, ChevronRight } from "lucide";

import { Icon } from "./icon.tsx";
import { ListingPhoto } from "./listing-photo.tsx";
import { ListingCarousel } from "./public/listing-carousel.tsx";

const SLIDE_CLASS = "aspect-[4/3] max-h-[70svh] w-full md:aspect-[16/9]";

export function ListingGallery(handle: Handle<{ images: ListingImage[] }>) {
  return () => {
    let { images } = handle.props;

    if (images.length === 0) {
      return (
        <ListingPhoto
          image={null}
          class={`${SLIDE_CLASS} border-obsidian-700 border`}
        />
      );
    }

    return (
      <ListingCarousel
        count={images.length}
        slides={images.map((image, index) => (
          <li
            key={image.url}
            aria-roledescription="diapositive"
            aria-label={`${index + 1} sur ${images.length}`}
            class="w-full shrink-0 snap-start"
          >
            <ListingPhoto
              image={image}
              class={SLIDE_CLASS}
              isPriority={index === 0}
            />
          </li>
        ))}
        previousIcon={
          <Icon icon={ChevronLeft} class="size-5" strokeWidth={1.5} />
        }
        nextIcon={<Icon icon={ChevronRight} class="size-5" strokeWidth={1.5} />}
      />
    );
  };
}
