import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";

import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { searchHref } from "./search-href.ts";

describe("searchHref", () => {
  let cases: [Partial<ListListingsQuery>, string][] = [
    [{ page: 1 }, "/search"],
    [
      { city: "Nice", maxPrice: 3000000, page: 1 },
      "/search?city=Nice&maxPrice=3000000",
    ],
    [
      { city: undefined, energyClasses: ["E", "F", "G"], page: 2 },
      "/search?energyClasses=E%2CF%2CG&page=2",
    ],
  ];
  for (let [query, expected] of cases) {
    it(`links ${JSON.stringify(query)} to ${expected}`, () => {
      assert.equal(searchHref(query), expected);
    });
  }
});
