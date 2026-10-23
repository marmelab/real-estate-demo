import type { Handle } from "remix/component";

import { clientEntry, on } from "remix/component";

export const ImageFileInput = clientEntry(
  import.meta.url,
  function ImageFileInput(
    handle: Handle<{ label: string; name: string; error?: string }>,
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
          mix={on("change", (event) => {
            if (event.currentTarget.files?.length) {
              event.currentTarget.form?.requestSubmit();
            }
          })}
          class="file:border-obsidian-600 file:bg-obsidian-800 file:text-gold hover:file:border-gold focus-visible:outline-gold w-full text-sm text-gray-300 file:mr-4 file:min-h-11 file:border file:px-4 file:text-xs file:tracking-[0.15em] file:uppercase focus-visible:outline-2"
        />
        <p aria-live="polite" class="text-sm text-red-300 empty:hidden">
          {handle.props.error}
        </p>
      </div>
    );
  },
);
