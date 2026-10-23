import { listAdminListings } from "@remix-v3-demo/domain/listing/list-admin-listings";
import { listAdminListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { TARGET_CITIES } from "@remix-v3-demo/domain/listing/target-cities";
import { createController } from "remix/router";

import { requireStaff } from "../../../middleware/require-staff.ts";
import { supabaseSession } from "../../../middleware/supabase-session.ts";
import { routes } from "../../../routes.ts";
import { renderStaffPage } from "../render-admin-page.tsx";
import { AdminListingTable } from "./admin-listing-table.tsx";
import { AdminListingFilters } from "./public/admin-listing-filters.tsx";

export default createController(routes.admin.listings, {
  middleware: [supabaseSession(), requireStaff()],
  actions: {
    async index(context) {
      let query = listAdminListingsQuerySchema.parse(
        Object.fromEntries(context.url.searchParams),
      );
      let { listings, total } = await listAdminListings(
        context.supabase,
        query,
      );
      return renderStaffPage(context, {
        title: "Annonces",
        page: (
          <div class="space-y-8">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <h1 class="text-3xl font-light text-white">Annonces</h1>
              <a
                href={routes.admin.listings.new.index.href()}
                class="button-gold"
              >
                Nouvelle annonce
              </a>
            </div>
            <AdminListingFilters
              q={query.q}
              city={query.city}
              status={query.status}
              sort={query.sort}
              order={query.order}
              cities={TARGET_CITIES.map(({ name }) => name)}
            />
            <AdminListingTable
              listings={listings}
              total={total}
              query={query}
            />
          </div>
        ),
      });
    },
  },
});
