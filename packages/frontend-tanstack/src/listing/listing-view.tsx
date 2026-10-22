import type { Listing } from "@remix-v3-demo/domain/listing/model";

import { formatAddress } from "@remix-v3-demo/domain/listing/format-address";
import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";
import { PROPERTY_TYPE_LABELS } from "@remix-v3-demo/domain/listing/property-type-labels";
import { Link } from "@tanstack/react-router";

import { ListingImagePlaceholder } from "./listing-image-placeholder.tsx";
import { ListingPhoto } from "./listing-photo.tsx";

export function ListingView({ listing }: { listing: Listing }) {
  const facts = [
    ["Type de bien", PROPERTY_TYPE_LABELS[listing.propertyType]],
    ["Surface", listing.surfaceArea && `${listing.surfaceArea} m²`],
    ["Terrain", listing.landArea && `${listing.landArea} m²`],
    ["Pièces", listing.rooms],
    ["Chambres", listing.bedrooms],
    ["Classe énergie (DPE)", listing.energyClass],
  ].filter(([, value]) => value);

  return (
    <article className="space-y-8 pt-6 pb-20">
      <Link
        to="/search"
        search={{ city: listing.city }}
        className="eyebrow hover:text-gold-light focus-visible:outline-gold inline-flex min-h-11 items-center focus-visible:outline-2"
      >
        ← Retour à la recherche
      </Link>
      <div className="border-obsidian-700 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">
            {PROPERTY_TYPE_LABELS[listing.propertyType]}
          </p>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl">
            {listing.title}
          </h1>
          <p className="mt-1 text-sm text-gray-300">{formatAddress(listing)}</p>
        </div>
        <div className="md:text-right">
          <p className="text-xs tracking-widest text-gray-400 uppercase">
            Prix
          </p>
          <p className="text-gold text-3xl font-semibold">
            {formatPrice(listing.price)}
          </p>
        </div>
      </div>
      {listing.images.length === 0 ? (
        <ListingImagePlaceholder className="border-obsidian-700 aspect-[4/3] w-full border md:aspect-[16/7]" />
      ) : (
        <ul className="border-obsidian-700 bg-obsidian-950 flex snap-x snap-mandatory gap-3 overflow-x-auto border p-1 md:grid md:grid-cols-2 md:overflow-visible">
          {listing.images.map((image) => (
            <li key={image.url} className="w-full shrink-0 snap-start">
              <ListingPhoto image={image} className="aspect-[4/3] w-full" />
            </li>
          ))}
        </ul>
      )}
      <dl className="border-obsidian-700 bg-obsidian-800 grid grid-cols-2 gap-4 border p-5 text-center sm:grid-cols-3 lg:grid-cols-6">
        {facts.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="text-gold text-xs font-semibold tracking-widest uppercase">
              {label}
            </dt>
            <dd className="text-xl font-light text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-8 md:grid-cols-3">
        <section className="space-y-4 md:col-span-2">
          <h2 className="text-xl font-light text-white">Description</h2>
          <p className="leading-relaxed font-light whitespace-pre-line text-gray-300">
            {listing.description}
          </p>
        </section>
        {listing.agent && (
          <aside className="border-gold bg-obsidian-800 h-fit space-y-4 border p-5">
            <div className="flex items-center gap-3">
              <span className="border-gold bg-obsidian-900 text-gold flex size-11 items-center justify-center border text-sm font-semibold">
                {listing.agent.firstName[0]}
                {listing.agent.lastName[0]}
              </span>
              <div>
                <p className="font-semibold text-white">
                  {listing.agent.firstName} {listing.agent.lastName}
                </p>
                <p className="eyebrow">Votre conseiller privé</p>
              </div>
            </div>
            <p className="text-sm font-light text-gray-300">
              Les visites de cette résidence sont organisées en toute discrétion
              par notre bureau.
            </p>
          </aside>
        )}
      </div>
    </article>
  );
}
