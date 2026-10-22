import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { CitySearchForm } from "./city-search-form.tsx";

describe("CitySearchForm", () => {
  it.each([
    [
      { city: "Nice", maxPrice: "3000000" },
      { city: "Nice", maxPrice: 3000000 },
    ],
    [{ city: "", maxPrice: "" }, {}],
  ])(
    "should search %o from the first page",
    async ({ city, maxPrice }, expected) => {
      const onSearch = vi.fn();
      await render(<CitySearchForm onSearch={onSearch} />);

      await page.getByLabelText("Ville").fill(city);
      await page.getByLabelText("Budget max (€)").fill(maxPrice);
      await page.getByRole("button", { name: "Rechercher" }).click();

      expect(onSearch).toHaveBeenCalledWith({ ...expected, page: 1 });
    },
  );
});
