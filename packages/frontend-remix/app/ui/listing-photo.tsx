import type { ListingImage } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { Logo } from "./logo.tsx";

export function ListingPhoto(
  handle: Handle<{ image: ListingImage | null; class: string }>,
) {
  return () => {
    let { image } = handle.props;

    return (
      <div class={`relative overflow-hidden ${handle.props.class}`}>
        <div class="bg-obsidian-950 text-gold absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Logo class="size-14" />
          <p class="eyebrow text-gray-400">Photos sur demande</p>
        </div>
        {image && (
          <img
            src={image.url}
            alt=""
            loading="lazy"
            class="absolute inset-0 size-full object-cover"
          />
        )}
      </div>
    );
  };
}
