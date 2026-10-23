import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { AdminListingFilters } from "./admin-listing-filters.tsx";

const search = { sort: "price", order: "asc", page: 3 } as const;

async function renderFilters() {
  const onSearch = vi.fn();
  await render(<AdminListingFilters search={search} onSearch={onSearch} />);
  return onSearch;
}

describe("AdminListingFilters", () => {
  it("should search back on the first page as soon as a select changes", async () => {
    const onSearch = await renderFilters();

    await page.getByRole("combobox", { name: /^Ville/ }).selectOptions("Lyon");

    await expect
      .poll(() => onSearch.mock.lastCall)
      .toEqual([{ city: "Lyon", sort: "price", order: "asc", page: 1 }]);
  });

  it("should search once the title stops changing", async () => {
    const onSearch = await renderFilters();

    await page.getByLabelText("Titre").fill("Penthouse");

    await expect
      .poll(() => onSearch.mock.calls)
      .toEqual([[{ q: "Penthouse", sort: "price", order: "asc", page: 1 }]]);
  });
});
