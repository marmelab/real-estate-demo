import type { ListingImage } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { css } from "remix/component";

import { ListingPhoto } from "./listing-photo.tsx";

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

    let radioId = (index: number) => `${handle.id}-photo-${index}`;
    let slideRules: Record<
      `&${string}`,
      Record<string, string>
    > = Object.fromEntries(
      images.flatMap((_, index) => {
        let checked = `& > input:nth-of-type(${index + 1}):checked`;
        return [
          [`${checked} ~ ul`, { transform: `translateX(-${index * 100}%)` }],
          [
            `${checked} ~ div:nth-of-type(${index + 1})`,
            { visibility: "visible", opacity: "1" },
          ],
        ];
      }),
    );

    return (
      <section
        aria-roledescription="carrousel"
        aria-label="Photos du bien"
        mix={css(slideRules)}
        class="border-obsidian-700 bg-obsidian-950 has-focus-visible:outline-gold relative overflow-hidden border has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
      >
        {images.length > 1 &&
          images.map((_, index) => (
            <input
              key={index}
              id={radioId(index)}
              type="radio"
              name={handle.id}
              checked={index === 0}
              aria-label={`Photo ${index + 1} sur ${images.length}`}
              class="sr-only"
            />
          ))}
        <ul class="flex transition-transform duration-500">
          {images.map((image, index) => (
            <li
              key={image.url}
              aria-roledescription="diapositive"
              aria-label={`${index + 1} sur ${images.length}`}
              class="w-full shrink-0"
            >
              <ListingPhoto image={image} class={SLIDE_CLASS} />
            </li>
          ))}
        </ul>
        {images.length > 1 &&
          images.map((_, index) => (
            <div
              key={index}
              class="pointer-events-none invisible absolute inset-0 opacity-0 transition-[opacity,visibility] duration-500 *:pointer-events-auto"
            >
              {index > 0 && (
                <SlideLabel
                  label="Photo précédente"
                  htmlFor={radioId(index - 1)}
                  class="left-3"
                  path="m15 18-6-6 6-6"
                />
              )}
              {index < images.length - 1 && (
                <SlideLabel
                  label="Photo suivante"
                  htmlFor={radioId(index + 1)}
                  class="right-3"
                  path="m9 18 6-6-6-6"
                />
              )}
              <p class="eyebrow border-obsidian-700 bg-obsidian-950/85 absolute right-3 bottom-3 border px-3 py-1">
                {index + 1} / {images.length}
              </p>
            </div>
          ))}
      </section>
    );
  };
}

function SlideLabel(
  handle: Handle<{
    label: string;
    htmlFor: string;
    class: string;
    path: string;
  }>,
) {
  return () => (
    <label
      htmlFor={handle.props.htmlFor}
      title={handle.props.label}
      class={`border-gold bg-obsidian-950/85 text-gold hover:bg-gold hover:text-obsidian-950 absolute top-1/2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center border transition-colors ${handle.props.class}`}
    >
      <span class="sr-only">{handle.props.label}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
        class="size-5"
      >
        <path d={handle.props.path} />
      </svg>
    </label>
  );
}
