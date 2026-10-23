import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it, type TestContext } from "remix/test";

import { AdminListingFilters } from "./admin-listing-filters.tsx";

function renderFilters(t: TestContext) {
  let timers = t.useFakeTimers();
  let result = render(
    <AdminListingFilters
      q="villa"
      city="Lyon"
      status="draft"
      sort="price"
      order="asc"
      cities={["Paris", "Lyon"]}
    />,
  );
  let form = result.$("form") as HTMLFormElement;
  let requestSubmit = t.mock.method(form, "requestSubmit", () => {});
  let type = (value: string) => {
    let input = result.$('input[name="q"]') as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  return { ...result, timers, requestSubmit, type };
}

describe("AdminListingFilters", () => {
  it("preselects the current filters", (t) => {
    let { $, cleanup } = renderFilters(t);
    t.after(cleanup);

    assert.deepEqual(
      ["q", "city", "status", "sort", "order"].map(
        (name) => ($(`[name="${name}"]`) as HTMLInputElement).value,
      ),
      ["villa", "Lyon", "draft", "price", "asc"],
    );
  });

  it("submits once 300 ms after typing", (t) => {
    let { cleanup, timers, requestSubmit, type } = renderFilters(t);
    t.after(cleanup);

    type("vil");
    type("villa");
    timers.advance(299);
    let callsBefore = requestSubmit.mock.calls.length;
    timers.advance(1);

    assert.deepEqual([callsBefore, requestSubmit.mock.calls.length], [0, 1]);
  });

  it("restarts the delay when typing again", (t) => {
    let { cleanup, timers, requestSubmit, type } = renderFilters(t);
    t.after(cleanup);

    type("vil");
    timers.advance(200);
    type("villa");
    timers.advance(200);
    let callsBefore = requestSubmit.mock.calls.length;
    timers.advance(100);

    assert.deepEqual([callsBefore, requestSubmit.mock.calls.length], [0, 1]);
  });

  it("submits at once when a select changes", (t) => {
    let { $, cleanup, timers, requestSubmit } = renderFilters(t);
    t.after(cleanup);
    let status = $('select[name="status"]') as HTMLSelectElement;

    status.value = "published";
    status.dispatchEvent(new Event("input", { bubbles: true }));
    timers.advance(0);

    assert.equal(requestSubmit.mock.calls.length, 1);
  });

  it("does not submit once removed", (t) => {
    let { cleanup, timers, requestSubmit, type } = renderFilters(t);

    type("villa");
    cleanup();
    timers.advance(300);

    assert.equal(requestSubmit.mock.calls.length, 0);
  });
});
