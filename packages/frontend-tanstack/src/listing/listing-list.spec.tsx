import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingList } from "./listing-list.tsx";

const listing: ListingSummary = {
  id: 3,
  title: "Hôtel particulier · Brotteaux",
  price: 640000,
  propertyType: "house",
  surfaceArea: 140,
  rooms: 6,
  bedrooms: 4,
  city: "Lyon",
  postalCode: "69004",
  image: null,
};

async function renderList(
  listings: ListingSummary[],
  total: number,
  search: ListListingsQuery = { city: "Lyon", page: 1 },
) {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => (
        <ListingList listings={listings} total={total} search={search} />
      ),
    }),
    history: createMemoryHistory(),
  });
  await render(<RouterProvider router={router} />);
}

function getPageLinks() {
  return page
    .getByRole("navigation", { name: "Pagination" })
    .getByRole("link")
    .elements()
    .map((link) => [link.textContent, link.getAttribute("href")]);
}

describe("ListingList", () => {
  it.each([
    [0, "0 résidence d'exception"],
    [1, "1 résidence d'exception"],
    [2, "2 résidences d'exception"],
  ])("should count %i result in French", async (total, count) => {
    await renderList([listing], total);

    await expect.element(page.getByText(count)).toBeVisible();
  });

  it("should show the empty state when no listing matches", async () => {
    await renderList([], 0);

    await expect
      .element(
        page.getByRole("heading", { name: "Aucune résidence ne correspond" }),
      )
      .toBeVisible();
  });

  it.each([
    [1, 12, []],
    [1, 30, [["Suivant", "/search?city=Lyon&page=2"]]],
    [
      2,
      30,
      [
        ["Précédent", "/search?city=Lyon&page=1"],
        ["Suivant", "/search?city=Lyon&page=3"],
      ],
    ],
    [3, 30, [["Précédent", "/search?city=Lyon&page=2"]]],
  ])(
    "should link page %i of %i results to its neighbour search pages",
    async (currentPage, total, links) => {
      await renderList([listing], total, { city: "Lyon", page: currentPage });

      await expect
        .element(page.getByRole("link", { name: /Brotteaux/ }))
        .toBeVisible();
      await expect.poll(getPageLinks).toEqual(links);
    },
  );
});
