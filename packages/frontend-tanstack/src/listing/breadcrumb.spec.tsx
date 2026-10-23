import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { Breadcrumb } from "./breadcrumb.tsx";

async function renderBreadcrumb() {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => <Breadcrumb current="Lyon" />,
    }),
    history: createMemoryHistory({ initialEntries: ["/immobilier/lyon"] }),
  });
  await render(<RouterProvider router={router} />);
}

describe("Breadcrumb", () => {
  it("should link back to the home page", async () => {
    await renderBreadcrumb();

    await expect
      .element(page.getByRole("link", { name: "Accueil" }))
      .toHaveAttribute("href", "/");
  });

  it("should mark the current page", async () => {
    await renderBreadcrumb();

    await expect
      .element(page.getByText("Lyon"))
      .toHaveAttribute("aria-current", "page");
  });
});
