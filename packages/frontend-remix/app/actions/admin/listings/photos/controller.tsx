import { deleteListingImage } from "@remix-v3-demo/domain/listing-image/delete-listing-image";
import { listingImageAltSchema } from "@remix-v3-demo/domain/listing-image/listing-image-validator";
import { reorderListingImages } from "@remix-v3-demo/domain/listing-image/reorder-listing-images";
import { updateListingImage } from "@remix-v3-demo/domain/listing-image/update-listing-image";
import { uploadListingImage } from "@remix-v3-demo/domain/listing-image/upload-listing-image";
import { redirect } from "remix/response/redirect";
import { createController } from "remix/router";

import { requireStaff } from "../../../../middleware/require-staff.ts";
import { supabaseSession } from "../../../../middleware/supabase-session.ts";
import { routes } from "../../../../routes.ts";
import { readImageFile } from "../../../../ui/form/read-image-file.ts";
import { readText } from "../../../../ui/form/read-text.ts";
import {
  findListing,
  renderListingEditPage,
  renderListingNotFound,
} from "../edit/render-listing-edit-page.tsx";
import { moveImage } from "./move-image.ts";

const MOVE_OFFSETS: Record<string, number> = { up: -1, down: 1 };

function redirectToPhotos(listingId: string, status: 302 | 303 = 303) {
  return redirect(
    routes.admin.listings.edit.index.href(
      { listingId },
      { searchParams: { tab: "photos" } },
    ),
    status,
  );
}

export default createController(routes.admin.listings.photos, {
  middleware: [supabaseSession(), requireStaff()],
  actions: {
    index(context) {
      return redirectToPhotos(context.params.listingId, 302);
    },
    show(context) {
      return redirectToPhotos(context.params.listingId, 302);
    },
    async create(context) {
      let found = await findListing(context, context.params.listingId);
      if (!found) return renderListingNotFound(context);
      let { file, error } = readImageFile(context.formData, "file");
      if (!file) {
        return renderListingEditPage(context, found, {
          tab: "photos",
          uploadError: error,
          status: 400,
        });
      }
      try {
        await uploadListingImage(context.supabase, found.listing.id, file);
      } catch (uploadError) {
        console.error(uploadError);
        return renderListingEditPage(context, found, {
          tab: "photos",
          uploadError: "L'envoi de la photo a échoué",
          status: 400,
        });
      }
      return redirectToPhotos(context.params.listingId);
    },
    async update(context) {
      let found = await findListing(context, context.params.listingId);
      if (!found) return renderListingNotFound(context);
      let { listing } = found;
      let ids = listing.images.map((image) => image.id);
      let imageId = Number(context.params.imageId);
      let index = ids.indexOf(imageId);
      let image = listing.images[index];
      if (!image) return renderListingNotFound(context);
      let intent = readText(context.formData, "intent");
      let target = index + (MOVE_OFFSETS[intent] ?? 0);
      let alt = listingImageAltSchema.safeParse(
        readText(context.formData, "alt"),
      );

      try {
        if (intent === "delete") {
          await deleteListingImage(context.supabase, imageId);
          return redirectToPhotos(context.params.listingId);
        }
        if (!alt.success) throw alt.error;
        if (alt.data !== image.alt) {
          await updateListingImage(context.supabase, imageId, {
            alt: alt.data,
          });
        }
        if (target !== index && target >= 0 && target < ids.length) {
          await reorderListingImages(
            context.supabase,
            listing.id,
            moveImage(ids, index, target),
          );
        }
      } catch (error) {
        console.error(error);
        return renderListingEditPage(context, found, {
          tab: "photos",
          photoError: "La modification des photos a échoué",
          status: 400,
        });
      }
      return redirectToPhotos(context.params.listingId);
    },
  },
});
