import { listAgents } from "@remix-v3-demo/domain/agent/list-agents";
import { createListing } from "@remix-v3-demo/domain/listing/create-listing";
import { listingInputSchema } from "@remix-v3-demo/domain/listing/listing-validator";
import * as s from "remix/data-schema";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import type { StaffContext } from "../../../../middleware/require-staff.ts";
import type { FieldErrors } from "../../../../ui/form/get-field-errors.ts";
import type { ListingFormValues } from "../listing-form-values.ts";

import { requireStaff } from "../../../../middleware/require-staff.ts";
import { supabaseSession } from "../../../../middleware/supabase-session.ts";
import { routes } from "../../../../routes.ts";
import { getFieldErrors } from "../../../../ui/form/get-field-errors.ts";
import { getSubmitErrorMessage } from "../../../../ui/get-submit-error-message.ts";
import { renderStaffPage } from "../../render-admin-page.tsx";
import {
  findTabWithError,
  parseListingFormTab,
  readListingForm,
  toFormValues,
} from "../listing-form-values.ts";
import { ListingForm } from "../listing-form.tsx";

async function renderNewListing(
  context: StaffContext,
  form: {
    values?: ListingFormValues;
    errors?: FieldErrors;
    error?: string;
  } = {},
  status = 200,
) {
  let { agents } = await listAgents(context.supabase, { page: 1 });
  let errorTab = form.errors && findTabWithError(form.errors);
  return renderStaffPage(context, {
    title: "Nouvelle annonce",
    status,
    page: (
      <ListingForm
        title="Nouvelle annonce"
        action={routes.admin.listings.new.action.href()}
        values={form.values ?? toFormValues()}
        agents={agents}
        isManager={context.staff.role === "manager"}
        tab={
          errorTab ?? parseListingFormTab(context.url.searchParams.get("tab"))
        }
        errors={form.errors}
        error={form.error}
      />
    ),
  });
}

export default createController(routes.admin.listings.new, {
  middleware: [supabaseSession(), requireStaff()],
  actions: {
    index(context) {
      return renderNewListing(context);
    },
    async action(context) {
      let values = readListingForm(
        context.formData,
        context.staff.role === "manager",
      );
      let parsed = s.parseSafe(listingInputSchema, values);
      if (!parsed.success) {
        return renderNewListing(
          context,
          { values, errors: getFieldErrors(parsed.issues) },
          400,
        );
      }
      try {
        let { id } = await createListing(context.supabase, parsed.value);
        return redirect(
          routes.admin.listings.edit.index.href(
            { listingId: String(id) },
            { searchParams: { tab: "photos" } },
          ),
          303,
        );
      } catch (error) {
        return renderNewListing(
          context,
          {
            values,
            error: getSubmitErrorMessage(error, "Enregistrement impossible"),
          },
          400,
        );
      }
    },
  },
});
