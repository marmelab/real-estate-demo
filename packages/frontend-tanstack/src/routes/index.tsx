import { listListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { createFileRoute } from "@tanstack/react-router";

import {
  listListingsQueryOptions,
  useListListings,
} from "../listing/hook/list-listings.ts";
import { ListingList } from "../listing/listing-list.tsx";
import { ListingSearchForm } from "../listing/listing-search-form.tsx";
import { getListingSearchTitle } from "../listing/listing-search-title.ts";

export const Route = createFileRoute("/")({
  validateSearch: listListingsQuerySchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(listListingsQueryOptions(deps)),
  head: ({ match }) => {
    const title = getListingSearchTitle(match.search);
    return {
      meta: [
        { title: `${title} | Real estate agency` },
        {
          name: "description",
          content: `${title}: browse the agency's listings and filter them by price, rooms and surface.`,
        },
      ],
    };
  },
  component: Home,
});

function Home() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useListListings(search);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {getListingSearchTitle(search)}
      </h1>
      <ListingSearchForm
        search={search}
        onSearch={(nextSearch) => navigate({ search: nextSearch })}
      />
      <ListingList
        listings={data.listings}
        total={data.total}
        search={search}
      />
    </div>
  );
}
