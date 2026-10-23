import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { findTabWithError, readListingForm } from "./listing-form-values.ts";

describe("listing form values", () => {
  it("opens the first tab holding an invalid field", () => {
    assert.equal(
      findTabWithError({ latitude: "Champ requis", rooms: "Trop petit" }),
      "details",
    );
  });

  it("keeps the stored publication when an agent saves", () => {
    let formData = new FormData();
    formData.set("published", "on");

    let values = readListingForm(formData, false, {
      title: "Villa",
      description: "",
      propertyType: "house",
      price: 2300000,
      surfaceArea: null,
      landArea: null,
      rooms: null,
      bedrooms: null,
      energyClass: null,
      address: "",
      postalCode: "06400",
      city: "Cannes",
      latitude: 43.55,
      longitude: 7.01,
      published: false,
      agentId: null,
    });

    assert.equal(values.published, false);
  });
});
