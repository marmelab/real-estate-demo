import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { Breadcrumb } from "./breadcrumb.tsx";

describe("Breadcrumb", () => {
  it("links Accueil to the home page and marks the current item", (t) => {
    let { $, cleanup } = render(<Breadcrumb current="Lyon" />);
    t.after(cleanup);

    assert.equal($("a")?.getAttribute("href"), "/");
    assert.equal($('[aria-current="page"]')?.textContent, "Lyon");
  });
});
