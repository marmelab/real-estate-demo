import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import { getListingSearchTitle } from "@remix-v3-demo/domain/listing/get-listing-search-title";
import { listListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { createFileRoute } from "@tanstack/react-router";

import { Breadcrumb } from "../listing/breadcrumb.tsx";
import {
  listListingsQueryOptions,
  useListListings,
} from "../listing/hook/list-listings.ts";
import { ListingList } from "../listing/listing-list.tsx";
import { ListingSearchForm } from "../listing/listing-search-form.tsx";

export const Route = createFileRoute("/_site/search")({
  validateSearch: listListingsQuerySchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(listListingsQueryOptions(deps)),
  head: ({ match }) => {
    const title = getListingSearchTitle(match.search);
    return {
      meta: [
        { title: `${title} | Keyhaven` },
        {
          name: "description",
          content: `${title} : résidences d'exception à vendre, sélectionnées par Keyhaven.`,
        },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-6 pb-20">
      <Breadcrumb current="Recherche" />
      <h1 className="sr-only">{getListingSearchTitle(search)}</h1>
      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <aside aria-label="Filtres">
          <ListingSearchForm
            key={JSON.stringify(search)}
            search={search}
            onSearch={(nextSearch) => navigate({ search: nextSearch })}
          />
        </aside>
        <div className="lg:col-span-2">
          <SearchResults search={search} />
        </div>
      </div>
    </div>
  );
}

function SearchResults({ search }: { search: ListListingsQuery }) {
  const { data } = useListListings(search);

  return (
    <ListingList listings={data.listings} total={data.total} search={search} />
  );
}
