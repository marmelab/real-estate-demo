import { findTargetCity } from "@remix-v3-demo/domain/listing/find-target-city";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Breadcrumb } from "../listing/breadcrumb.tsx";
import { CITY_INTROS } from "../listing/city-intros.ts";
import {
  listListingsQueryOptions,
  useListListings,
} from "../listing/hook/list-listings.ts";
import { ListingList } from "../listing/listing-list.tsx";

export const Route = createFileRoute("/immobilier/$city")({
  params: {
    parse: ({ city }) => {
      const targetCity = findTargetCity(city);
      if (!targetCity) throw notFound();
      return { city: targetCity.slug };
    },
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      listListingsQueryOptions({ city: getCityName(params.city), page: 1 }),
    ),
  head: ({ params }) => ({
    meta: [
      {
        title: `Immobilier de prestige à ${getCityName(params.city)} | Keyhaven`,
      },
      { name: "description", content: CITY_INTROS[params.city] },
    ],
  }),
  component: CityPage,
});

function getCityName(slug: string): string {
  return findTargetCity(slug)?.name ?? slug;
}

function CityPage() {
  const { city } = Route.useParams();
  const name = getCityName(city);
  const search = { city: name, page: 1 };
  const { data } = useListListings(search);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-20">
      <Breadcrumb current={name} />
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-light tracking-tight text-white sm:text-5xl">
          Immobilier de prestige à{" "}
          <span className="text-gold italic">{name}</span>
        </h1>
        <p className="leading-relaxed font-light text-gray-300">
          {CITY_INTROS[city]}
        </p>
        <Link to="/search" search={search} className="button-outline">
          Affiner la recherche
        </Link>
      </div>
      <ListingList
        listings={data.listings}
        total={data.total}
        search={search}
        isFullWidth
      />
    </div>
  );
}
