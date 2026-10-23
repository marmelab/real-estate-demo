import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { Pagination } from "./pagination.tsx";

function renderPage(page: number, total: number) {
  return render(
    <Pagination
      page={page}
      pageSize={10}
      total={total}
      getPageHref={(target) => `/admin/listings?page=${target}`}
    />,
  );
}

describe("Pagination", () => {
  it("renders nothing for a single page", (t) => {
    let { container, cleanup } = renderPage(1, 10);
    t.after(cleanup);

    assert.equal(container.innerHTML, "");
  });

  let cases: [string, number, Record<string, string>][] = [
    [
      "only Suivant on the first page",
      1,
      { Suivant: "/admin/listings?page=2" },
    ],
    [
      "both links on a middle page",
      2,
      {
        Précédent: "/admin/listings?page=1",
        Suivant: "/admin/listings?page=3",
      },
    ],
    [
      "only Précédent on the last page",
      3,
      { Précédent: "/admin/listings?page=2" },
    ],
  ];
  for (let [label, page, links] of cases) {
    it(`links ${label}`, (t) => {
      let { $$, cleanup } = renderPage(page, 25);
      t.after(cleanup);

      assert.deepEqual(
        Object.fromEntries(
          [...$$("a")].map((link) => [
            link.textContent,
            link.getAttribute("href"),
          ]),
        ),
        links,
      );
    });
  }
});
