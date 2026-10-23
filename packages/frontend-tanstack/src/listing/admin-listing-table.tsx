import type { ListAdminListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { AdminListingSummary } from "@remix-v3-demo/domain/listing/model";

import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";
import { ADMIN_PAGE_SIZE } from "@remix-v3-demo/domain/listing/list-admin-listings";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Pagination } from "../components/pagination.tsx";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeZone: "Europe/Paris",
});

export function AdminListingTable({
  listings,
  total,
  search,
}: {
  listings: AdminListingSummary[];
  total: number;
  search: ListAdminListingsQuery;
}) {
  if (listings.length === 0) {
    return <p className="py-12 text-center text-gray-300">Aucune annonce</p>;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Annonces, {total} au total</caption>
          <thead className="border-obsidian-600 border-b">
            <tr>
              <SortableHeader label="Titre" column="title" search={search} />
              <th scope="col" className="eyebrow px-3 py-3">
                Ville
              </th>
              <SortableHeader label="Prix" column="price" search={search} />
              <th scope="col" className="eyebrow px-3 py-3">
                Statut
              </th>
              <th scope="col" className="eyebrow px-3 py-3">
                Agent
              </th>
              <SortableHeader
                label="Créée le"
                column="createdAt"
                search={search}
              />
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-obsidian-700 border-b">
                <th scope="row" className="px-3 py-3 font-normal">
                  <Link
                    to="/admin/listings/$listingId"
                    params={{ listingId: listing.id }}
                    className="hover:text-gold focus-visible:outline-gold text-white underline-offset-4 hover:underline focus-visible:outline-2"
                  >
                    {listing.title}
                  </Link>
                </th>
                <td className="px-3 py-3">{listing.city}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {formatPrice(listing.price)}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`border px-2 py-1 text-xs tracking-[0.15em] uppercase ${listing.published ? "border-gold text-gold" : "border-obsidian-600 text-gray-300"}`}
                  >
                    {listing.published ? "Publiée" : "Brouillon"}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {listing.agent
                    ? `${listing.agent.firstName} ${listing.agent.lastName}`
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  {dateFormat.format(new Date(listing.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={search.page} pageSize={ADMIN_PAGE_SIZE} total={total} />
    </div>
  );
}

function SortableHeader({
  label,
  column,
  search,
}: {
  label: string;
  column: ListAdminListingsQuery["sort"];
  search: ListAdminListingsQuery;
}) {
  const isSorted = search.sort === column;
  const nextOrder = isSorted && search.order === "asc" ? "desc" : "asc";

  return (
    <th
      scope="col"
      aria-sort={
        isSorted
          ? search.order === "asc"
            ? "ascending"
            : "descending"
          : undefined
      }
      className="px-3 py-3"
    >
      <Link
        to="."
        search={{ ...search, sort: column, order: nextOrder, page: 1 }}
        className="eyebrow hover:text-gold-light focus-visible:outline-gold inline-flex min-h-11 items-center gap-1 focus-visible:outline-2"
      >
        {label}
        {isSorted &&
          (search.order === "asc" ? (
            <ChevronUp aria-hidden="true" className="size-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="size-4" />
          ))}
      </Link>
    </th>
  );
}
