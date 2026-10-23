import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { Pagination } from "./pagination.tsx";

async function renderPagination(currentPage: number, total: number) {
  const router = createRouter({
    routeTree: createRootRoute({
      component: () => (
        <>
          <h1>Agents</h1>
          <Pagination page={currentPage} pageSize={10} total={total} />
        </>
      ),
    }),
    history: createMemoryHistory({
      initialEntries: [`/?city=Lyon&page=${currentPage}`],
    }),
  });
  await render(<RouterProvider router={router} />);
}

function getPageLinks() {
  return page
    .getByRole("link")
    .elements()
    .map((link) => [link.textContent, link.getAttribute("href")]);
}

describe("Pagination", () => {
  it("should render nothing when every result fits on one page", async () => {
    await renderPagination(1, 10);

    await expect.element(page.getByRole("heading")).toBeVisible();
    expect(page.getByRole("navigation").elements()).toEqual([]);
  });

  it.each([
    [1, [["Suivant", "/?city=Lyon&page=2"]]],
    [
      2,
      [
        ["Précédent", "/?city=Lyon&page=1"],
        ["Suivant", "/?city=Lyon&page=3"],
      ],
    ],
    [3, [["Précédent", "/?city=Lyon&page=2"]]],
  ])(
    "should link to the neighbour pages from page %i of 3",
    async (currentPage, links) => {
      await renderPagination(currentPage, 30);

      await expect.poll(getPageLinks).toEqual(links);
    },
  );
});
