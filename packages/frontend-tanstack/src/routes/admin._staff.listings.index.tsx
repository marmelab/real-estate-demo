import type { ListAdminListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import { listAdminListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { Link, createFileRoute } from "@tanstack/react-router";

import { AdminListingFilters } from "../listing/admin-listing-filters.tsx";
import { AdminListingTable } from "../listing/admin-listing-table.tsx";
import {
  listAdminListingsQueryOptions,
  useListAdminListings,
} from "../listing/hook/list-admin-listings.ts";

export const Route = createFileRoute("/admin/_staff/listings/")({
  validateSearch: listAdminListingsQuerySchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(listAdminListingsQueryOptions(deps)),
  head: () => ({ meta: [{ title: "Annonces | Keyhaven" }] }),
  component: AdminListingsPage,
});

function AdminListingsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-light text-white">Annonces</h1>
        <Link to="/admin/listings/new" className="button-gold">
          Nouvelle annonce
        </Link>
      </div>
      <AdminListingFilters
        search={search}
        onSearch={(nextSearch) => navigate({ search: nextSearch })}
      />
      <AdminListings search={search} />
    </div>
  );
}

function AdminListings({ search }: { search: ListAdminListingsQuery }) {
  const { data } = useListAdminListings(search);
  return (
    <AdminListingTable
      listings={data.listings}
      total={data.total}
      search={search}
    />
  );
}
