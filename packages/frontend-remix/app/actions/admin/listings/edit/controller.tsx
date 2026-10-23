import { deleteListing } from "@remix-v3-demo/domain/listing/delete-listing";
import { listingInputSchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { updateListing } from "@remix-v3-demo/domain/listing/update-listing";
import * as s from "remix/data-schema";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import { requireStaff } from "../../../../middleware/require-staff.ts";
import { supabaseSession } from "../../../../middleware/supabase-session.ts";
import { routes } from "../../../../routes.ts";
import { getFieldErrors } from "../../../../ui/form/get-field-errors.ts";
import { getSubmitErrorMessage } from "../../../../ui/get-submit-error-message.ts";
import { findTabWithError, readListingForm } from "../listing-form-values.ts";
import {
  findListing,
  renderListingEditPage,
  renderListingNotFound,
} from "./render-listing-edit-page.tsx";

export default createController(routes.admin.listings.edit, {
  middleware: [supabaseSession(), requireStaff()],
  actions: {
    async index(context) {
      let found = await findListing(context, context.params.listingId);
      if (!found) return renderListingNotFound(context);
      return renderListingEditPage(context, found);
    },
    async action(context) {
      let found = await findListing(context, context.params.listingId);
      if (!found) return renderListingNotFound(context);
      let values = readListingForm(
        context.formData,
        context.staff.role === "manager",
        found.listing,
      );
      let parsed = s.parseSafe(listingInputSchema, values);
      if (!parsed.success) {
        let errors = getFieldErrors(parsed.issues);
        return renderListingEditPage(context, found, {
          tab: findTabWithError(errors),
          values,
          errors,
          status: 400,
        });
      }
      try {
        await updateListing(context.supabase, found.listing.id, parsed.value);
      } catch (error) {
        return renderListingEditPage(context, found, {
          tab: "general",
          values,
          error: getSubmitErrorMessage(error, "Enregistrement impossible"),
          status: 400,
        });
      }
      return redirect(routes.admin.listings.index.href(), 303);
    },
    async destroy(context) {
      let found = await findListing(context, context.params.listingId);
      if (!found) return renderListingNotFound(context);
      try {
        await deleteListing(context.supabase, found.listing.id);
      } catch (error) {
        return renderListingEditPage(context, found, {
          tab: "general",
          error: getSubmitErrorMessage(error, "Enregistrement impossible"),
          status: 400,
        });
      }
      return redirect(routes.admin.listings.index.href(), 303);
    },
  },
});
