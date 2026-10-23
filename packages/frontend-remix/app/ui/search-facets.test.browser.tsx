import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { SearchFacets } from "./search-facets.tsx";

describe("SearchFacets", () => {
  it("links each chip to the search with that facet, from the first page", (t) => {
    let { $$, cleanup } = render(
      <SearchFacets query={{ city: "Lyon", minBedrooms: 3, page: 2 }} />,
    );
    t.after(cleanup);
    let hrefs = [...$$("a")].map((link) => link.getAttribute("href"));

    assert.ok(
      hrefs.includes("/search?city=Lyon&minBedrooms=3&propertyType=house"),
    );
    assert.ok(
      hrefs.includes("/search?city=Lyon&minBedrooms=3&energyClasses=E%2CF%2CG"),
    );
  });

  it("marks the chip matching the search as current", (t) => {
    let { $$, cleanup } = render(
      <SearchFacets query={{ minBedrooms: 3, page: 1 }} />,
    );
    t.after(cleanup);

    assert.deepEqual(
      [...$$('[aria-current="true"]')].map((chip) => chip.textContent),
      ["Indifférent", "Toutes", "3+", "Toutes"],
    );
  });

  it("toggles the filters on mobile from the Filtres label", async (t) => {
    let { $, act, cleanup } = render(<SearchFacets query={{ page: 1 }} />);
    t.after(cleanup);
    let toggle = $('input[type="checkbox"]') as HTMLInputElement;

    await act(() => $("label")?.click());

    assert.equal(toggle.checked, true);
  });
});
