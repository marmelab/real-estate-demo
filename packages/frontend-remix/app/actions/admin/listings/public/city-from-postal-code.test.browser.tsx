import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it, type TestContext } from "remix/test";

import { CityFromPostalCode } from "./city-from-postal-code.tsx";

function renderWithFields(t: TestContext) {
  let fields = document.createElement("div");
  fields.innerHTML =
    '<input id="postal-code"><select id="city"><option value="">Choisir</option><option>Paris</option><option>Lyon</option></select>';
  document.body.append(fields);
  t.after(() => fields.remove());
  let postalCode = fields.querySelector("input") as HTMLInputElement;
  let city = fields.querySelector("select") as HTMLSelectElement;
  let result = render(
    <CityFromPostalCode postalCodeId="postal-code" cityId="city" />,
  );
  let type = (value: string) => {
    postalCode.value = value;
    postalCode.dispatchEvent(new Event("input", { bubbles: true }));
  };
  return { ...result, city, type };
}

describe("CityFromPostalCode", () => {
  it("selects the target city matching the postal code", (t) => {
    let { cleanup, city, type } = renderWithFields(t);
    t.after(cleanup);

    type("69003");

    assert.equal(city.value, "Lyon");
  });

  it("keeps the city for a postal code outside the target cities", (t) => {
    let { cleanup, city, type } = renderWithFields(t);
    t.after(cleanup);
    city.value = "Paris";

    type("33000");

    assert.equal(city.value, "Paris");
  });

  it("stops updating the city once removed", (t) => {
    let { cleanup, city, type } = renderWithFields(t);

    cleanup();
    type("69003");

    assert.equal(city.value, "");
  });
});
