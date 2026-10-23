import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";

import { FavoriteButton } from "../favorite/favorite-button.tsx";
import { ListingPhoto } from "./listing-photo.tsx";

export function ListingCard({ listing }: { listing: ListingSummary }) {
  const facts = [
    ["Pièces", listing.rooms],
    ["Chambres", listing.bedrooms],
    ["m²", listing.surfaceArea],
  ] as const;

  return (
    <div className="relative flex w-full transition hover:-translate-y-0.5">
      <Link
        to="/listings/$listingId"
        params={{ listingId: listing.id }}
        className="group border-obsidian-600 bg-obsidian-800 hover:border-gold focus-visible:outline-gold flex w-full flex-col border focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <div className="border-obsidian-700 relative overflow-hidden border-b">
          <ListingPhoto
            image={listing.image}
            className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="border-obsidian-700 bg-obsidian-950/85 absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 border p-2">
            <p className="text-gold text-xl font-semibold">
              {formatPrice(listing.price)}
            </p>
            <p className="flex items-center gap-1 text-[10px] tracking-widest text-gray-300 uppercase">
              <MapPin aria-hidden="true" className="text-gold size-3" />
              {listing.city}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h2 className="line-clamp-2 text-lg font-medium text-white">
              {listing.title}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              {listing.postalCode} {listing.city}
            </p>
          </div>
          <dl className="border-obsidian-700 mt-auto grid grid-cols-3 border-y py-2 text-center text-xs text-gray-300">
            {facts.map(([label, value]) => (
              <div
                key={label}
                className="not-first:border-obsidian-700 flex flex-col-reverse not-first:border-l"
              >
                <dt>{label}</dt>
                <dd className="font-bold text-white">{value ?? "–"}</dd>
              </div>
            ))}
          </dl>
          <p className="eyebrow inline-flex items-center gap-2">
            Voir le bien <ArrowRight aria-hidden="true" className="size-4" />
          </p>
        </div>
      </Link>
      <FavoriteButton
        listingId={listing.id}
        className="absolute top-3 right-3"
      />
    </div>
  );
}
