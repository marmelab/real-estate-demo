import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import {
  getListingByIdQueryOptions,
  useGetListingById,
} from "../listing/hook/get-listing-by-id.ts";
import { ListingView } from "../listing/listing-view.tsx";

const DESCRIPTION_MAX_LENGTH = 160;

export const Route = createFileRoute("/listings/$listingId")({
  params: {
    parse: ({ listingId }) => {
      const id = Number(listingId);
      if (!Number.isSafeInteger(id) || id < 1) throw notFound();
      return { listingId: id };
    },
    stringify: ({ listingId }) => ({ listingId: String(listingId) }),
  },
  loader: async ({ context, params }) => {
    const listing = await context.queryClient.ensureQueryData(
      getListingByIdQueryOptions(params.listingId),
    );
    if (!listing) throw notFound();
    return listing;
  },
  head: ({ loaderData: listing }) =>
    listing
      ? {
          meta: [
            { title: `${listing.title} | Real estate agency` },
            {
              name: "description",
              content: listing.description.slice(0, DESCRIPTION_MAX_LENGTH),
            },
            ...(listing.images[0]
              ? [{ property: "og:image", content: listing.images[0].url }]
              : []),
          ],
        }
      : { meta: [{ title: "Listing not found | Real estate agency" }] },
  component: ListingPage,
  notFoundComponent: ListingNotFound,
});

function ListingPage() {
  const { listingId } = Route.useParams();
  const { data: listing } = useGetListingById(listingId);
  if (!listing) throw notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <ListingView listing={listing} />
    </div>
  );
}

function ListingNotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Listing not found</h1>
      <p className="text-gray-700">
        This listing does not exist or is no longer available.
      </p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        Back to search
      </Link>
    </div>
  );
}
