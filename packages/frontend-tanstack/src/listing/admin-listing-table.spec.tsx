import type { AdminListingSummary } from "@remix-v3-demo/domain/listing/model";

import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { AdminListingTable } from "./admin-listing-table.tsx";

const draft: AdminListingSummary = {
  id: 7,
  title: "Appartement Haussmannien · Monceau",
  price: 890000,
  propertyType: "apartment",
  city: "Paris",
  postalCode: "75008",
  agent: { firstName: "Claire", lastName: "Martin" },
  published: false,
  createdAt: "2026-10-01T09:00:00+00:00",
};

async function renderTable(listings: AdminListingSummary[]) {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => (
        <AdminListingTable
          listings={listings}
          total={listings.length}
          search={{ sort: "createdAt", order: "desc", page: 1 }}
        />
      ),
    }),
    history: createMemoryHistory(),
  });
  await render(<RouterProvider router={router} />);
}

describe("AdminListingTable", () => {
  it("should show a draft with its status and its price in euros", async () => {
    await renderTable([draft]);

    await expect
      .element(page.getByRole("cell", { name: "Brouillon" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("cell", { name: /^890\s000\s€$/ }))
      .toBeVisible();
  });

  it("should show the empty state when no listing matches", async () => {
    await renderTable([]);

    await expect.element(page.getByText("Aucune annonce")).toBeVisible();
  });
});
