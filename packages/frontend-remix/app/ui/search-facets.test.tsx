import * as assert from "remix/assert";
import { renderToString } from "remix/component/server";
import { describe, it } from "remix/test";

import { SearchFacets } from "./search-facets.tsx";

describe("SearchFacets", () => {
  it("links each chip to the search with that facet, from the first page", async () => {
    let html = await renderToString(
      <SearchFacets query={{ city: "Lyon", minBedrooms: 3, page: 2 }} />,
    );

    assert.match(
      html,
      /href="\/search\?city=Lyon&amp;minBedrooms=3&amp;propertyType=house"/,
    );
    assert.match(
      html,
      /href="\/search\?city=Lyon&amp;minBedrooms=3&amp;energyClasses=E%2CF%2CG"/,
    );
  });

  it("marks the chip matching the search as current", async () => {
    let html = await renderToString(
      <SearchFacets query={{ minBedrooms: 3, page: 1 }} />,
    );

    assert.equal(html.match(/aria-current="true"[^>]*>3\+</g)?.length, 1);
  });
});
