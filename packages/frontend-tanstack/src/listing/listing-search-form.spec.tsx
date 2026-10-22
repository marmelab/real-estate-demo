import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { ListingSearchForm } from "./listing-search-form.tsx";

const firstVisit: ListListingsQuery = { transactionType: "sale", page: 1 };

describe("ListingSearchForm", () => {
  it("should hide the extra filters before a first search", async () => {
    await render(<ListingSearchForm search={firstVisit} onSearch={vi.fn()} />);

    await expect
      .element(page.getByLabelText("Min bedrooms"))
      .not.toBeInTheDocument();
  });

  it.each([{ city: "Lyon" }, { maxPrice: 1000 }])(
    "should show the extra filters once the search has %o",
    async (criterion) => {
      await render(
        <ListingSearchForm
          search={{ ...firstVisit, ...criterion }}
          onSearch={vi.fn()}
        />,
      );

      await expect.element(page.getByLabelText("Min rooms")).toBeVisible();
      await expect.element(page.getByLabelText("Min bedrooms")).toBeVisible();
      await expect
        .element(page.getByLabelText("Min surface (m²)"))
        .toBeVisible();
    },
  );

  it("should search the filled criteria from the first page, dropping empty fields", async () => {
    const onSearch = vi.fn();
    await render(
      <ListingSearchForm
        search={{ ...firstVisit, page: 3 }}
        onSearch={onSearch}
      />,
    );

    await page.getByRole("radio", { name: "Rent" }).click();
    await page.getByLabelText("City").fill("Lyon");
    await page.getByRole("button", { name: "Search" }).click();

    expect(onSearch).toHaveBeenCalledWith({
      transactionType: "rent",
      city: "Lyon",
      page: 1,
    });
  });
});
