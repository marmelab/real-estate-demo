import type { Agent } from "@remix-v3-demo/domain/agent/model";
import type { AdminListing } from "@remix-v3-demo/domain/listing/model";

import { listAgents } from "@remix-v3-demo/domain/agent/list-agents";
import { getAdminListingById } from "@remix-v3-demo/domain/listing/get-admin-listing-by-id";

import type { StaffContext } from "../../../../middleware/require-staff.ts";
import type { FieldErrors } from "../../../../ui/form/get-field-errors.ts";
import type {
  ListingFormTab,
  ListingFormValues,
} from "../listing-form-values.ts";

import { routes } from "../../../../routes.ts";
import { renderStaffPage } from "../../render-admin-page.tsx";
import { parseListingFormTab, toFormValues } from "../listing-form-values.ts";
import { ListingForm } from "../listing-form.tsx";
import { PhotoManager } from "../photo-manager.tsx";

export type ListingEditState = {
  tab?: ListingFormTab;
  values?: ListingFormValues;
  errors?: FieldErrors;
  error?: string;
  photoError?: string;
  uploadError?: string;
  status?: number;
};

export async function findListing(
  context: StaffContext,
  listingId: string,
): Promise<{ listing: AdminListing; agents: Agent[] } | null> {
  let id = Number(listingId);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  let [listing, { agents }] = await Promise.all([
    getAdminListingById(context.supabase, id),
    listAgents(context.supabase, { page: 1 }),
  ]);
  return listing ? { listing, agents } : null;
}

export function renderListingNotFound(context: StaffContext) {
  return renderStaffPage(context, {
    title: "Annonce",
    status: 404,
    page: <p class="text-gray-300">Cette annonce n'existe pas.</p>,
  });
}

export function renderListingEditPage(
  context: StaffContext,
  { listing, agents }: { listing: AdminListing; agents: Agent[] },
  state: ListingEditState = {},
) {
  let listingId = String(listing.id);
  return renderStaffPage(context, {
    title: listing.title,
    status: state.status,
    page: (
      <ListingForm
        title={listing.title}
        action={routes.admin.listings.edit.action.href({ listingId })}
        values={state.values ?? toFormValues(listing)}
        agents={agents}
        isManager={context.staff.role === "manager"}
        tab={
          state.tab ?? parseListingFormTab(context.url.searchParams.get("tab"))
        }
        errors={state.errors}
        error={state.error}
        canDelete
        photos={
          <PhotoManager
            listingId={listing.id}
            images={listing.images}
            error={state.photoError}
            uploadError={state.uploadError}
          />
        }
      />
    ),
  });
}
