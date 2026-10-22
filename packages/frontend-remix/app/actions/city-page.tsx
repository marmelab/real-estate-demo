import type { ListingSearchResult } from "@remix-v3-demo/domain/listing/list-listings";
import type { TargetCity } from "@remix-v3-demo/domain/listing/target-cities";
import type { Handle } from "remix/component";

import { CITY_INTROS } from "@remix-v3-demo/domain/listing/city-intros";

import { Breadcrumb } from "../ui/breadcrumb.tsx";
import { ListingList } from "../ui/listing-list.tsx";
import { searchHref } from "../ui/search-href.ts";

export function CityPage(
  handle: Handle<{ city: TargetCity; result: ListingSearchResult }>,
) {
  return () => {
    let { city, result } = handle.props;
    let query = { city: city.name, page: 1 };

    return (
      <div class="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-20">
        <Breadcrumb current={city.name} />
        <div class="max-w-3xl space-y-4">
          <h1 class="text-3xl font-light tracking-tight text-white sm:text-5xl">
            Immobilier de prestige à{" "}
            <span class="text-gold italic">{city.name}</span>
          </h1>
          <p class="leading-relaxed font-light text-gray-300">
            {CITY_INTROS[city.slug]}
          </p>
          <a href={searchHref(query)} class="button-outline">
            Affiner la recherche
          </a>
        </div>
        <ListingList result={result} query={query} isFullWidth />
      </div>
    );
  };
}
