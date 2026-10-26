import type { Handle } from "remix/component";

import { resizeListingImage } from "@remix-v3-demo/domain/listing-image/resize-listing-image";
import { clientEntry, on } from "remix/component";

function toFileList(file: File): FileList {
  let transfer = new DataTransfer();
  transfer.items.add(file);
  return transfer.files;
}

export const ImageFileInput = clientEntry(
  import.meta.url,
  function ImageFileInput(
    handle: Handle<{
      label: string;
      name: string;
      mobileName?: string;
      error?: string;
    }>,
  ) {
    return () => (
      <div class="flex flex-col gap-2">
        <label htmlFor={handle.id} class="field-label">
          {handle.props.label}
        </label>
        <input
          id={handle.id}
          type="file"
          name={handle.props.name}
          accept="image/jpeg,image/png,image/webp"
          mix={on("change", async (event) => {
            let input = event.currentTarget;
            let file = input.files?.[0];
            if (!file) return;
            let mobileInput = handle.props.mobileName
              ? input.form?.elements.namedItem(handle.props.mobileName)
              : null;
            if (mobileInput instanceof HTMLInputElement) {
              try {
                let { desktop, mobile } = await resizeListingImage(file);
                input.files = toFileList(desktop);
                mobileInput.files = toFileList(mobile);
              } catch (error) {
                console.error(error);
              }
            }
            input.form?.requestSubmit();
          })}
          class="file:border-obsidian-600 file:bg-obsidian-800 file:text-gold hover:file:border-gold focus-visible:outline-gold w-full text-sm text-gray-300 file:mr-4 file:min-h-11 file:border file:px-4 file:text-xs file:tracking-[0.15em] file:uppercase focus-visible:outline-2"
        />
        {handle.props.mobileName && (
          <input type="file" name={handle.props.mobileName} hidden />
        )}
        <p aria-live="polite" class="text-sm text-red-300 empty:hidden">
          {handle.props.error}
        </p>
      </div>
    );
  },
);
