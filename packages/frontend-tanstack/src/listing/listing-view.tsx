import type {
  Listing,
  PropertyType,
} from "@remix-v3-demo/domain/listing/model";

import { formatAddress } from "@remix-v3-demo/domain/listing/format-address";
import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";
import { Link } from "@tanstack/react-router";

import { ListingImagePlaceholder } from "./listing-image-placeholder.tsx";
import { ListingPhoto } from "./listing-photo.tsx";

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: "House",
  apartment: "Apartment",
  land: "Land",
  commercial: "Commercial",
};

export function ListingView({ listing }: { listing: Listing }) {
  const facts = [
    ["Property type", PROPERTY_TYPE_LABELS[listing.propertyType]],
    ["Surface", listing.surfaceArea && `${listing.surfaceArea} m²`],
    ["Land", listing.landArea && `${listing.landArea} m²`],
    ["Rooms", listing.rooms],
    ["Bedrooms", listing.bedrooms],
    ["Energy class", listing.energyClass],
  ].filter(([, value]) => value);

  return (
    <article className="space-y-6 py-6">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        ← Back to search
      </Link>
      {listing.images.length === 0 ? (
        <ListingImagePlaceholder className="aspect-[4/3] w-full rounded-lg md:aspect-[16/7]" />
      ) : (
        <ul className="flex snap-x snap-mandatory gap-2 overflow-x-auto md:grid md:grid-cols-2 md:overflow-visible">
          {listing.images.map((image) => (
            <li key={image.url} className="w-full shrink-0 snap-start">
              <ListingPhoto
                image={image}
                className="aspect-[4/3] w-full rounded-lg"
              />
            </li>
          ))}
        </ul>
      )}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
        <p className="text-xl font-semibold text-gray-900">
          {formatPrice(listing.price, listing.transactionType)}
        </p>
        <p className="text-gray-600">{formatAddress(listing)}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 rounded-lg bg-white p-4 sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-gray-600">{label}</dt>
            <dd className="font-medium text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="whitespace-pre-line text-gray-800">{listing.description}</p>
      {listing.agent && (
        <p className="text-gray-700">
          Agent: {listing.agent.firstName} {listing.agent.lastName}
        </p>
      )}
    </article>
  );
}
