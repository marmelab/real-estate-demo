import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { Landing } from "./landing.tsx";

describe("Landing", () => {
  it("links to the SEO page of each target city", (t) => {
    let { $$, cleanup } = render(<Landing />);
    t.after(cleanup);

    assert.deepEqual(
      [...$$('nav[aria-label="Nos villes"] a')].map((link) => [
        link.textContent,
        link.getAttribute("href"),
      ]),
      [
        ["Paris", "/immobilier/paris"],
        ["Lyon", "/immobilier/lyon"],
        ["Nice", "/immobilier/nice"],
        ["Cannes", "/immobilier/cannes"],
      ],
    );
  });

  it("searches by city and max price with a GET to /search", (t) => {
    let { $, $$, cleanup } = render(<Landing />);
    t.after(cleanup);
    let form = $("form") as HTMLFormElement;

    assert.deepEqual(
      {
        method: form.method,
        action: new URL(form.action).pathname,
        fields: [...$$("form input")].map((input) =>
          input.getAttribute("name"),
        ),
      },
      { method: "get", action: "/search", fields: ["city", "maxPrice"] },
    );
  });
});
