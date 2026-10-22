import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingSearchForm } from "./listing-search-form.tsx";

async function renderForm(search: ListListingsQuery) {
  const onSearch = vi.fn();
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => (
        <ListingSearchForm search={search} onSearch={onSearch} />
      ),
    }),
    history: createMemoryHistory(),
  });
  await render(<RouterProvider router={router} />);
  await page.getByRole("button", { name: "Afficher les filtres" }).click();
  return onSearch;
}

describe("ListingSearchForm", () => {
  it("should check the facets matching the search", async () => {
    await renderForm({ city: "Lyon", minBedrooms: 3, page: 1 });

    await expect
      .element(
        page
          .getByRole("group", { name: "Chambres" })
          .getByRole("radio", { name: "3+" }),
      )
      .toBeChecked();
  });

  it.each([
    ["Maison", { propertyType: "house" }],
    ["E-", { energyClasses: ["E", "F", "G"] }],
  ])(
    "should search from the first page as soon as the %s facet is chosen",
    async (facet, criterion) => {
      const onSearch = await renderForm({ city: "Lyon", page: 3 });

      await page.getByText(facet, { exact: true }).click();

      expect(onSearch).toHaveBeenCalledWith({
        city: "Lyon",
        ...criterion,
        page: 1,
      });
    },
  );

  it("should search the typed criteria, dropping empty fields", async () => {
    const onSearch = await renderForm({ page: 1 });

    await page.getByLabelText("Ville").fill("Lyon");
    await page
      .getByRole("group", { name: "Surface (m²)" })
      .getByLabelText("Maximum")
      .fill("200");
    await page.getByRole("button", { name: "Appliquer" }).click();

    expect(onSearch).toHaveBeenCalledWith({
      city: "Lyon",
      maxSurface: 200,
      page: 1,
    });
  });
});
