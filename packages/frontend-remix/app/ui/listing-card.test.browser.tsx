import type { ListingSummary } from "@remix-v3-demo/domain/listing/model";

import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { ListingCard } from "./listing-card.tsx";

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

describe("ListingCard", () => {
  it("links to the listing page with its price and title", (t) => {
    let { $, cleanup } = render(<ListingCard listing={listing} />);
    t.after(cleanup);
    let link = $("a");

    assert.equal(link?.getAttribute("href"), "/listings/3");
    assert.match(
      link?.textContent ?? "",
      /640\s000\s€.*Hôtel particulier · Brotteaux/,
    );
  });

  it("shows a dash for each missing fact", (t) => {
    let { $$, cleanup } = render(
      <ListingCard
        listing={{ ...listing, rooms: null, bedrooms: null, surfaceArea: null }}
      />,
    );
    t.after(cleanup);

    assert.deepEqual(
      [...$$("dd")].map((value) => value.textContent),
      ["–", "–", "–"],
    );
  });
});
