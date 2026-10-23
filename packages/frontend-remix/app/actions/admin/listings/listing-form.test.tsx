import * as assert from "remix/assert";
import { renderToString } from "remix/component/server";
import { describe, it } from "remix/test";

import { toFormValues } from "./listing-form-values.ts";
import { ListingForm } from "./listing-form.tsx";

describe("ListingForm", () => {
  let publishCases: [string, boolean, number][] = [
    ["a manager", true, 1],
    ["an agent", false, 0],
  ];
  for (let [label, isManager, count] of publishCases) {
    it(`shows the publish checkbox only to managers, here ${label}`, async () => {
      let html = await renderToString(
        <ListingForm
          title="Nouvelle annonce"
          action="/admin/listings/new"
          values={toFormValues()}
          agents={[]}
          isManager={isManager}
          tab="general"
        />,
      );

      assert.equal(html.match(/name="published"/g)?.length ?? 0, count);
    });
  }
});
