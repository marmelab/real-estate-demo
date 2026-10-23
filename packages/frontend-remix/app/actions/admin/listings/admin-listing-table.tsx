import type { ListAdminListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { AdminListingSummary } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { formatPrice } from "@remix-v3-demo/domain/listing/format-price";
import { ADMIN_PAGE_SIZE } from "@remix-v3-demo/domain/listing/list-admin-listings";
import { ChevronDown, ChevronUp } from "lucide";

import { routes } from "../../../routes.ts";
import { Icon } from "../../../ui/icon.tsx";
import { Pagination } from "../../../ui/pagination.tsx";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeZone: "Europe/Paris",
});

export function getAdminListingsHref(query: ListAdminListingsQuery): string {
  let searchParams = Object.fromEntries(
    Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
  return routes.admin.listings.index.href(undefined, { searchParams });
}

export function AdminListingTable(
  handle: Handle<{
    listings: AdminListingSummary[];
    total: number;
    query: ListAdminListingsQuery;
  }>,
) {
  return () => {
    let { listings, total, query } = handle.props;
    if (listings.length === 0) {
      return <p class="py-12 text-center text-gray-300">Aucune annonce</p>;
    }

    return (
      <div class="space-y-6">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-sm">
            <caption class="sr-only">Annonces, {total} au total</caption>
            <thead class="border-obsidian-600 border-b">
              <tr>
                <SortableHeader label="Titre" column="title" query={query} />
                <th scope="col" class="eyebrow px-3 py-3">
                  Ville
                </th>
                <SortableHeader label="Prix" column="price" query={query} />
                <th scope="col" class="eyebrow px-3 py-3">
                  Statut
                </th>
                <th scope="col" class="eyebrow px-3 py-3">
                  Agent
                </th>
                <SortableHeader
                  label="Créée le"
                  column="createdAt"
                  query={query}
                />
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} class="border-obsidian-700 border-b">
                  <th scope="row" class="px-3 py-3 font-normal">
                    <a
                      href={routes.admin.listings.edit.index.href({
                        listingId: String(listing.id),
                      })}
                      class="hover:text-gold focus-visible:outline-gold text-white underline-offset-4 hover:underline focus-visible:outline-2"
                    >
                      {listing.title}
                    </a>
                  </th>
                  <td class="px-3 py-3">{listing.city}</td>
                  <td class="px-3 py-3 whitespace-nowrap">
                    {formatPrice(listing.price)}
                  </td>
                  <td class="px-3 py-3">
                    <span
                      class={`border px-2 py-1 text-xs tracking-[0.15em] uppercase ${listing.published ? "border-gold text-gold" : "border-obsidian-600 text-gray-300"}`}
                    >
                      {listing.published ? "Publiée" : "Brouillon"}
                    </span>
                  </td>
                  <td class="px-3 py-3">
                    {listing.agent
                      ? `${listing.agent.firstName} ${listing.agent.lastName}`
                      : "—"}
                  </td>
                  <td class="px-3 py-3">
                    {dateFormat.format(new Date(listing.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={query.page}
          pageSize={ADMIN_PAGE_SIZE}
          total={total}
          getPageHref={(page) => getAdminListingsHref({ ...query, page })}
        />
      </div>
    );
  };
}

function SortableHeader(
  handle: Handle<{
    label: string;
    column: ListAdminListingsQuery["sort"];
    query: ListAdminListingsQuery;
  }>,
) {
  return () => {
    let { label, column, query } = handle.props;
    let isSorted = query.sort === column;
    let nextOrder: ListAdminListingsQuery["order"] =
      isSorted && query.order === "asc" ? "desc" : "asc";

    return (
      <th
        scope="col"
        aria-sort={
          isSorted
            ? query.order === "asc"
              ? "ascending"
              : "descending"
            : undefined
        }
        class="px-3 py-3"
      >
        <a
          href={getAdminListingsHref({
            ...query,
            sort: column,
            order: nextOrder,
            page: 1,
          })}
          class="eyebrow hover:text-gold-light focus-visible:outline-gold inline-flex min-h-11 items-center gap-1 focus-visible:outline-2"
        >
          {label}
          {isSorted && (
            <Icon
              icon={query.order === "asc" ? ChevronUp : ChevronDown}
              class="size-4"
            />
          )}
        </a>
      </th>
    );
  };
}
