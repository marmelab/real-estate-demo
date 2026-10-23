import type { ListAdminListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { AdminListingSummary } from "@remix-v3-demo/domain/listing/model";

import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { AdminListingTable } from "./admin-listing-table.tsx";

const listing: AdminListingSummary = {
  id: 3,
  title: "Hôtel particulier · Brotteaux",
  price: 640000,
  propertyType: "house",
  city: "Lyon",
  postalCode: "69004",
  agent: null,
  published: false,
  createdAt: "2026-03-05T10:00:00Z",
};

const query: ListAdminListingsQuery = { sort: "price", order: "asc", page: 2 };

function renderTable(listings: AdminListingSummary[]) {
  return render(
    <AdminListingTable listings={listings} total={30} query={query} />,
  );
}

describe("AdminListingTable", () => {
  it("shows the empty state without listings", (t) => {
    let { container, cleanup } = renderTable([]);
    t.after(cleanup);

    assert.equal(container.textContent, "Aucune annonce");
  });

  it("marks only the sorted column with aria-sort", (t) => {
    let { $$, cleanup } = renderTable([listing]);
    t.after(cleanup);

    assert.deepEqual(
      [...$$("th[aria-sort]")].map((header) => [
        header.textContent,
        header.getAttribute("aria-sort"),
      ]),
      [["Prix", "ascending"]],
    );
  });

  it("links each header to its column sort, toggling the order of the sorted one", (t) => {
    let { $$, cleanup } = renderTable([listing]);
    t.after(cleanup);

    assert.deepEqual(
      [...$$("thead a")].map((link) => [
        link.textContent,
        Object.fromEntries(
          new URL(link.getAttribute("href") ?? "", location.origin)
            .searchParams,
        ),
      ]),
      [
        ["Titre", { sort: "title", order: "asc", page: "1" }],
        ["Prix", { sort: "price", order: "desc", page: "1" }],
        ["Créée le", { sort: "createdAt", order: "asc", page: "1" }],
      ],
    );
  });

  it("shows a draft with its status and its price in euros", (t) => {
    let { $$, cleanup } = renderTable([listing]);
    t.after(cleanup);
    let cells = [...$$("tbody td")].map((cell) => cell.textContent);

    assert.equal(cells[2], "Brouillon");
    assert.match(cells[1] ?? "", /^640\s000\s€$/);
  });
});
