import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import { LISTING_PAGE_SIZE } from "@remix-v3-demo/domain/listing/list-listings";
import { Link } from "@tanstack/react-router";

import { ListingCard } from "./listing-card.tsx";

const PAGE_LINK_CLASS_NAME =
  "flex min-h-11 items-center rounded-md border border-gray-300 bg-white px-4 font-medium text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

export function ListingList({
  listings,
  total,
  search,
}: {
  listings: ListingSummary[];
  total: number;
  search: ListListingsQuery;
}) {
  const hasNextPage = search.page * LISTING_PAGE_SIZE < total;

  return (
    <section aria-label="Search results" className="space-y-4">
      <p className="text-gray-700">
        {total} {total === 1 ? "listing" : "listings"}
      </p>
      {listings.length === 0 ? (
        <p className="rounded-lg bg-white p-8 text-center text-gray-700">
          No listings match your search.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
      {(search.page > 1 || hasNextPage) && (
        <nav aria-label="Pagination" className="flex justify-between gap-4">
          {search.page > 1 ? (
            <Link
              to="/"
              search={{ ...search, page: search.page - 1 }}
              className={PAGE_LINK_CLASS_NAME}
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          {hasNextPage && (
            <Link
              to="/"
              search={{ ...search, page: search.page + 1 }}
              className={PAGE_LINK_CLASS_NAME}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}
