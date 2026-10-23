import type { Handle } from "remix/component";

import { clientEntry, on } from "remix/component";

import { routes } from "../../../../routes.ts";

const TYPING_DELAY_MS = 300;

export const AdminListingFilters = clientEntry(
  import.meta.url,
  function AdminListingFilters(
    handle: Handle<{
      q?: string;
      city?: string;
      status?: string;
      sort: string;
      order: string;
      cities: string[];
    }>,
  ) {
    let submitTimeout: ReturnType<typeof setTimeout> | undefined;
    handle.signal.addEventListener("abort", () => clearTimeout(submitTimeout));

    return () => {
      let { q, city, status, sort, order, cities } = handle.props;

      return (
        <form
          method="get"
          action={routes.admin.listings.index.href()}
          mix={on("input", (event) => {
            let form = event.currentTarget;
            clearTimeout(submitTimeout);
            submitTimeout = setTimeout(
              () => {
                let field = document.activeElement;
                form.requestSubmit();
                if (!(field instanceof HTMLElement) || !form.contains(field)) {
                  return;
                }
                navigation.addEventListener(
                  "navigatesuccess",
                  () => field.focus(),
                  { once: true, signal: handle.signal },
                );
              },
              event.target instanceof HTMLSelectElement ? 0 : TYPING_DELAY_MS,
            );
          })}
          class="border-obsidian-600 bg-obsidian-800 grid gap-4 border p-5 md:grid-cols-3"
        >
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="order" value={order} />
          <label class="field-label">
            Titre
            <input
              type="search"
              name="q"
              defaultValue={q}
              class="field-input"
            />
          </label>
          <label class="field-label">
            Ville
            <select name="city" class="field-input">
              <option value="" selected={!city}>
                Toutes
              </option>
              {cities.map((name) => (
                <option key={name} value={name} selected={name === city}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label class="field-label">
            Statut
            <select name="status" class="field-input">
              <option value="" selected={!status}>
                Tous
              </option>
              <option value="draft" selected={status === "draft"}>
                Brouillon
              </option>
              <option value="published" selected={status === "published"}>
                Publiée
              </option>
            </select>
          </label>
        </form>
      );
    };
  },
);
