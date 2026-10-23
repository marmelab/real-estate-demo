import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import {
  getListingByIdQueryOptions,
  useGetListingById,
} from "../listing/hook/get-listing-by-id.ts";
import { ListingView } from "../listing/listing-view.tsx";

const DESCRIPTION_MAX_LENGTH = 160;

export const Route = createFileRoute("/_site/listings/$listingId")({
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
            { title: `${listing.title} | Keyhaven` },
            {
              name: "description",
              content: listing.description.slice(0, DESCRIPTION_MAX_LENGTH),
            },
            ...(listing.images[0]
              ? [{ property: "og:image", content: listing.images[0].url }]
              : []),
          ],
        }
      : { meta: [{ title: "Bien introuvable | Keyhaven" }] },
  component: ListingPage,
  notFoundComponent: ListingNotFound,
});

function ListingPage() {
  const { listingId } = Route.useParams();
  const { data: listing } = useGetListingById(listingId);
  if (!listing) throw notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <ListingView listing={listing} />
    </div>
  );
}

function ListingNotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-20 text-center">
      <h1 className="text-3xl font-light text-white">Bien introuvable</h1>
      <p className="text-gray-300">
        Cette résidence n'existe pas ou n'est plus disponible.
      </p>
      <Link to="/" className="button-gold">
        Retour à la recherche
      </Link>
    </div>
  );
}
