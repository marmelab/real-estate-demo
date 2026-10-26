import type { ListingImage } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { Logo } from "./logo.tsx";

const MOBILE_MEDIA = "(max-width: 767px)";

export function ListingPhoto(
  handle: Handle<{
    image: ListingImage | null;
    class: string;
    isPriority?: boolean;
  }>,
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
          <picture>
            <source media={MOBILE_MEDIA} srcset={image.mobileUrl} />
            <img
              src={image.url}
              alt={image.alt}
              loading={handle.props.isPriority ? undefined : "lazy"}
              fetchpriority={handle.props.isPriority ? "high" : undefined}
              class="absolute inset-0 size-full object-cover"
            />
          </picture>
        )}
      </div>
    );
  };
}
