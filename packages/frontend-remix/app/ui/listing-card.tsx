import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";

import { routes } from "../routes.ts";
import { ListingPhoto } from "./listing-photo.tsx";

export function ListingCard(handle: Handle<{ listing: ListingSummary }>) {
  return () => {
    let { listing } = handle.props;
    let facts = [
      ["Pièces", listing.rooms],
      ["Chambres", listing.bedrooms],
      ["m²", listing.surfaceArea],
    ] as const;

    return (
      <a
        href={routes.listing.href({ listingId: String(listing.id) })}
        class="group border-obsidian-600 bg-obsidian-800 hover:border-gold focus-visible:outline-gold flex w-full flex-col border transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <div class="border-obsidian-700 relative border-b">
          <ListingPhoto
            image={listing.image}
            class="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div class="border-obsidian-700 bg-obsidian-950/85 absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 border p-2">
            <p class="text-gold text-xl font-semibold">
              {formatPrice(listing.price)}
            </p>
            <p class="flex items-center gap-1 text-[10px] tracking-widest text-gray-300 uppercase">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="text-gold size-3"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              {listing.city}
            </p>
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h2 class="line-clamp-2 text-lg font-medium text-white">
              {listing.title}
            </h2>
            <p class="mt-0.5 text-xs text-gray-400">
              {listing.postalCode} {listing.city}
            </p>
          </div>
          <dl class="border-obsidian-700 mt-auto grid grid-cols-3 border-y py-2 text-center text-xs text-gray-300">
            {facts.map(([label, value]) => (
              <div
                key={label}
                class="not-first:border-obsidian-700 flex flex-col-reverse not-first:border-l"
              >
                <dt>{label}</dt>
                <dd class="font-bold text-white">{value ?? "–"}</dd>
              </div>
            ))}
          </dl>
          <p class="eyebrow">Voir le bien →</p>
        </div>
      </a>
    );
  };
}
