import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";
import { Link } from "@tanstack/react-router";

import { ListingPhoto } from "./listing-photo.tsx";

export function ListingCard({ listing }: { listing: ListingSummary }) {
  const facts = [
    listing.surfaceArea && `${listing.surfaceArea} m²`,
    listing.rooms && `${listing.rooms} rooms`,
    listing.bedrooms && `${listing.bedrooms} bedrooms`,
  ].filter(Boolean);

  return (
    <Link
      to="/listings/$listingId"
      params={{ listingId: listing.id }}
      className="block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
    >
      <ListingPhoto image={listing.image} className="aspect-[4/3] w-full" />
      <div className="space-y-1 p-4">
        <p className="text-lg font-semibold text-gray-900">
          {formatPrice(listing.price, listing.transactionType)}
        </p>
        <h2 className="font-medium text-gray-900">{listing.title}</h2>
        <p className="text-sm text-gray-600">{listing.city}</p>
        {facts.length > 0 && (
          <p className="text-sm text-gray-600">{facts.join(" · ")}</p>
        )}
      </div>
    </Link>
  );
}
