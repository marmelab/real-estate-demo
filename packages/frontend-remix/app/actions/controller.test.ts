import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { router } from "../router.ts";
import { routes } from "../routes.ts";

function fetchPath(path: string) {
  return router.fetch(new URL(path, "http://localhost"));
}

describe("root controller", () => {
  it("GET / returns the landing page searching the target cities", async () => {
    let response = await fetchPath(routes.home.href());
    let html = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("Content-Type") ?? "", /text\/html/);
    assert.match(html, /<html lang="fr"/);
    assert.match(html, /<form method="get" action="\/search"/);
    for (let city of ["paris", "lyon", "nice", "cannes"]) {
      assert.match(html, new RegExp(`href="/immobilier/${city}"`));
    }
  });

  let notFoundCases: [string, string, string][] = [
    ["an unknown URL", "/nope", "Page introuvable"],
    [
      "a city the agency does not cover",
      "/immobilier/marseille",
      "Page introuvable",
    ],
    ["a malformed listing id", "/listings/abc", "Bien introuvable"],
  ];
  for (let [label, path, title] of notFoundCases) {
    it(`answers 404 for ${label}`, async () => {
      let response = await fetchPath(path);

      assert.equal(response.status, 404);
      assert.match(await response.text(), new RegExp(title));
    });
  }
});
