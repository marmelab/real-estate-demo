import type { AdminListingImage } from "@remix-v3-demo/domain/listing/model";
import type { Handle } from "remix/component";

import { ArrowDown, ArrowUp, Trash2 } from "lucide";

import { routes } from "../../../routes.ts";
import { ConfirmButton } from "../../../ui/confirm-button.tsx";
import { FormAlert } from "../../../ui/form/form-alert.tsx";
import { Icon } from "../../../ui/icon.tsx";
import { ImageFileInput } from "../../../ui/public/image-file-input.tsx";
import { AltTextInput } from "./public/alt-text-input.tsx";

export function PhotoManager(
  handle: Handle<{
    listingId: number;
    images: AdminListingImage[];
    error?: string;
    uploadError?: string;
  }>,
) {
  return () => {
    let { listingId, images, error, uploadError } = handle.props;
    let listingParams = { listingId: String(listingId) };

    return (
      <section aria-labelledby="listing-photos" class="space-y-6">
        <h2 id="listing-photos" class="eyebrow">
          Photos
        </h2>
        {images.length === 0 ? (
          <p class="text-gray-300">Aucune photo pour l'instant.</p>
        ) : (
          <ol class="space-y-4">
            {images.map((image, index) => (
              <li
                key={image.id}
                data-rmx-key={String(image.id)}
                class="border-obsidian-600 bg-obsidian-800 flex flex-col gap-4 border p-4 sm:flex-row"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  class="aspect-4/3 w-full shrink-0 object-cover sm:w-48"
                />
                <form
                  method="post"
                  action={routes.admin.listings.photos.update.href({
                    ...listingParams,
                    imageId: String(image.id),
                  })}
                  class="flex min-w-0 flex-1 flex-col gap-4"
                >
                  <p class="eyebrow">
                    Photo {index + 1}
                    {index === 0 && " · Couverture"}
                  </p>
                  <label class="field-label">
                    Texte alternatif
                    <AltTextInput name="alt" value={image.alt} />
                  </label>
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="submit"
                      name="intent"
                      value="up"
                      disabled={index === 0}
                      aria-label="Monter"
                      title="Monter"
                      class="button-outline size-11 px-0 disabled:opacity-40"
                    >
                      <Icon icon={ArrowUp} class="size-5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="down"
                      disabled={index === images.length - 1}
                      aria-label="Descendre"
                      title="Descendre"
                      class="button-outline size-11 px-0 disabled:opacity-40"
                    >
                      <Icon icon={ArrowDown} class="size-5" strokeWidth={1.5} />
                    </button>
                    <ConfirmButton
                      label="Supprimer"
                      icon={Trash2}
                      title="Supprimer cette photo ?"
                      message="La photo sera supprimée définitivement."
                      confirmLabel="Supprimer"
                      class="button-ghost size-11 px-0"
                      submitter={{ name: "intent", value: "delete" }}
                    />
                  </div>
                </form>
              </li>
            ))}
          </ol>
        )}
        <FormAlert message={error} />
        <form
          method="post"
          action={routes.admin.listings.photos.create.href(listingParams)}
          enctype="multipart/form-data"
        >
          <ImageFileInput
            label="Ajouter une photo"
            name="file"
            error={uploadError}
          />
        </form>
      </section>
    );
  };
}
