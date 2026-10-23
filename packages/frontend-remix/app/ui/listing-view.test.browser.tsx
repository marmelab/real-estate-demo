import type { Listing } from "@remix-v3-demo/domain/listing/model";

import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { ListingView } from "./listing-view.tsx";

const listing: Listing = {
  id: 3,
  title: "Appartement haussmannien · Bellecour",
  price: 890000,
  propertyType: "apartment",
  surfaceArea: 120,
  landArea: null,
  rooms: 5,
  bedrooms: 3,
  energyClass: "C",
  city: "Lyon",
  postalCode: "69002",
  address: "12 place Bellecour",
  description: "Vue sur la place.",
  images: [],
  agent: { firstName: "Claire", lastName: "Martin" },
};

describe("ListingView", () => {
  it("shows the price formatted in euros", (t) => {
    let { container, cleanup } = render(<ListingView listing={listing} />);
    t.after(cleanup);

    assert.match(container.textContent ?? "", /890\s000\s€/);
  });

  it("lists only the facts the listing has", (t) => {
    let { $$, cleanup } = render(<ListingView listing={listing} />);
    t.after(cleanup);

    assert.deepEqual(
      [...$$("dt")].map((label) => label.textContent),
      ["Type de bien", "Surface", "Pièces", "Chambres", "Classe énergie (DPE)"],
    );
  });

  for (let agent of [listing.agent, null]) {
    it(`shows the agent aside only with an agent, here ${agent ? "one" : "none"}`, (t) => {
      let { $, cleanup } = render(
        <ListingView listing={{ ...listing, agent }} />,
      );
      t.after(cleanup);

      assert.equal(
        $("aside")?.textContent?.includes("Claire Martin") ?? false,
        agent !== null,
      );
    });
  }

  it("links back to the search in the listing's city", (t) => {
    let { $, cleanup } = render(<ListingView listing={listing} />);
    t.after(cleanup);

    assert.equal($("a")?.getAttribute("href"), "/search?city=Lyon");
  });
});
