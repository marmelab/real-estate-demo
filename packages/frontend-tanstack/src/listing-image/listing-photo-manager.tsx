import type { AdminListingImage } from "@remix-v3-demo/domain/listing/model";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import { ConfirmButton } from "../components/confirm-button.tsx";
import { FormAlert } from "../components/form/form-alert.tsx";
import { useSubmitError } from "../components/form/use-submit-error.ts";
import { ImageFileInput } from "./image-file-input.tsx";

function moveImage(ids: number[], from: number, to: number): number[] {
  return ids.toSpliced(from, 1).toSpliced(to, 0, ...ids.slice(from, from + 1));
}

export function ListingPhotoManager({
  images,
  onUpload,
  onAltChange,
  onReorder,
  onDelete,
}: {
  images: AdminListingImage[];
  onUpload: (file: File) => Promise<void>;
  onAltChange: (id: number, alt: string) => Promise<void>;
  onReorder: (orderedIds: number[]) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const { error, submit: run } = useSubmitError(
    "La modification des photos a échoué",
  );
  const ids = images.map((image) => image.id);

  return (
    <section aria-labelledby="listing-photos" className="space-y-6">
      <h2 id="listing-photos" className="eyebrow">
        Photos
      </h2>
      {images.length === 0 ? (
        <p className="text-gray-300">Aucune photo pour l'instant.</p>
      ) : (
        <ol className="space-y-4">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="border-obsidian-600 bg-obsidian-800 flex flex-col gap-4 border p-4 sm:flex-row"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="aspect-4/3 w-full shrink-0 object-cover sm:w-48"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <p className="eyebrow">
                  Photo {index + 1}
                  {index === 0 && " · Couverture"}
                </p>
                <label className="field-label">
                  Texte alternatif
                  <input
                    defaultValue={image.alt}
                    maxLength={300}
                    onBlur={(event) => {
                      const alt = event.target.value;
                      if (alt === image.alt) return;
                      void run(() => onAltChange(image.id, alt));
                    }}
                    className="field-input"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() =>
                      run(() => onReorder(moveImage(ids, index, index - 1)))
                    }
                    aria-label="Monter"
                    title="Monter"
                    className="button-outline size-11 px-0 disabled:opacity-40"
                  >
                    <ArrowUp
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={1.5}
                    />
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() =>
                      run(() => onReorder(moveImage(ids, index, index + 1)))
                    }
                    aria-label="Descendre"
                    title="Descendre"
                    className="button-outline size-11 px-0 disabled:opacity-40"
                  >
                    <ArrowDown
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={1.5}
                    />
                  </button>
                  <ConfirmButton
                    label="Supprimer"
                    icon={
                      <Trash2
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={1.5}
                      />
                    }
                    title="Supprimer cette photo ?"
                    message="La photo sera supprimée définitivement."
                    confirmLabel="Supprimer"
                    className="button-ghost size-11 px-0"
                    onConfirm={() => void run(() => onDelete(image.id))}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      <FormAlert message={error} />
      <ImageFileInput label="Ajouter une photo" onUpload={onUpload} />
    </section>
  );
}
