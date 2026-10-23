import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

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

function renderList(total: number, page = 1) {
  return render(
    <ListingList
      result={{ listings: total ? [listing] : [], total }}
      query={{ city: "Lyon", page }}
    />,
  );
}

function links(anchors: NodeListOf<HTMLElement>) {
  return Object.fromEntries(
    [...anchors].map((link) => [link.textContent, link.getAttribute("href")]),
  );
}

describe("ListingList", () => {
  for (let [total, count] of [
    [1, "1 résidence d'exception"],
    [2, "2 résidences d'exception"],
  ] as const) {
    it(`counts ${count}`, (t) => {
      let { $, cleanup } = renderList(total);
      t.after(cleanup);

      assert.equal($("p")?.textContent, count);
    });
  }

  it("shows the empty state without listings", (t) => {
    let { $, cleanup } = renderList(0);
    t.after(cleanup);

    assert.equal($("h2")?.textContent, "Aucune résidence ne correspond");
  });

  let pages: [string, number, number, Record<string, string>][] = [
    ["no pagination on a single page", 1, 12, {}],
    [
      "Suivant on the first page",
      1,
      13,
      { Suivant: "/search?city=Lyon&page=2" },
    ],
    ["Précédent on the last page", 2, 13, { Précédent: "/search?city=Lyon" }],
  ];
  for (let [label, page, total, expected] of pages) {
    it(`links ${label}`, (t) => {
      let { $$, cleanup } = renderList(total, page);
      t.after(cleanup);

      assert.deepEqual(links($$('nav[aria-label="Pagination"] a')), expected);
    });
  }
});
