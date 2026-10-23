import type { Listing } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { formatAddress } from "@remix-v3-demo/domain/listing/format-address";
import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";
import { PROPERTY_TYPE_LABELS } from "@remix-v3-demo/domain/listing/property-type-labels";
import { ArrowLeft } from "lucide";

import { Icon } from "./icon.tsx";
import { ListingGallery } from "./listing-gallery.tsx";
import { searchHref } from "./search-href.ts";

export function ListingView(handle: Handle<{ listing: Listing }>) {
  return () => {
    let { listing } = handle.props;
    let facts = [
      ["Type de bien", PROPERTY_TYPE_LABELS[listing.propertyType]],
      ["Surface", listing.surfaceArea && `${listing.surfaceArea} m²`],
      ["Terrain", listing.landArea && `${listing.landArea} m²`],
      ["Pièces", listing.rooms],
      ["Chambres", listing.bedrooms],
      ["Classe énergie (DPE)", listing.energyClass],
    ].filter(([, value]) => value);

    return (
      <article class="space-y-8 pt-6 pb-20">
        <a
          href={searchHref({ city: listing.city })}
          class="eyebrow hover:text-gold-light focus-visible:outline-gold inline-flex min-h-11 items-center focus-visible:outline-2"
        >
          <Icon icon={ArrowLeft} class="mr-2 size-4" />
          Retour à la recherche
        </a>
        <div class="border-obsidian-700 flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
          <div>
            <p class="eyebrow">{PROPERTY_TYPE_LABELS[listing.propertyType]}</p>
            <h1 class="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl">
              {listing.title}
            </h1>
            <p class="mt-1 text-sm text-gray-300">{formatAddress(listing)}</p>
          </div>
          <div class="md:text-right">
            <p class="text-xs tracking-widest text-gray-400 uppercase">Prix</p>
            <p class="text-gold text-3xl font-semibold">
              {formatPrice(listing.price)}
            </p>
          </div>
        </div>
        <ListingGallery images={listing.images} />
        <dl class="border-obsidian-700 bg-obsidian-800 grid grid-cols-2 gap-4 border p-5 text-center sm:grid-cols-3 lg:grid-cols-6">
          {facts.map(([label, value]) => (
            <div key={String(label)} class="flex flex-col gap-1">
              <dt class="text-gold text-xs font-semibold tracking-widest uppercase">
                {label}
              </dt>
              <dd class="text-xl font-light text-white">{value}</dd>
            </div>
          ))}
        </dl>
        <div class="grid gap-8 md:grid-cols-3">
          <section class="space-y-4 md:col-span-2">
            <h2 class="text-xl font-light text-white">Description</h2>
            <p class="leading-relaxed font-light whitespace-pre-line text-gray-300">
              {listing.description}
            </p>
          </section>
          {listing.agent && (
            <aside class="border-gold bg-obsidian-800 h-fit space-y-4 border p-5">
              <div class="flex items-center gap-3">
                <span class="border-gold bg-obsidian-900 text-gold flex size-11 items-center justify-center border text-sm font-semibold">
                  {listing.agent.firstName[0]}
                  {listing.agent.lastName[0]}
                </span>
                <div>
                  <p class="font-semibold text-white">
                    {listing.agent.firstName} {listing.agent.lastName}
                  </p>
                  <p class="eyebrow">Votre conseiller privé</p>
                </div>
              </div>
              <p class="text-sm font-light text-gray-300">
                Les visites de cette résidence sont organisées en toute
                discrétion par notre bureau.
              </p>
            </aside>
          )}
        </div>
      </article>
    );
  };
}
