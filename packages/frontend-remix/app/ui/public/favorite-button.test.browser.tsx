import * as assert from "remix/assert";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { FavoriteButton } from "./favorite-button.tsx";
import { FavoriteCount } from "./favorite-count.tsx";

describe("FavoriteButton", () => {
  it("toggles the listing and updates the favorites count", async (t) => {
    document.cookie = "favorites=; Path=/; Max-Age=0";
    let { $, act, cleanup } = render(
      <div>
        <FavoriteCount count={0} />
        <FavoriteButton listingId={7} isFavorite={false} />
      </div>,
    );
    t.after(cleanup);
    let button = $("button") as HTMLButtonElement;
    let state = () => [
      button.getAttribute("aria-pressed"),
      $("a")?.textContent,
    ];

    await act(() => button.click());
    let afterAdd = state();
    await act(() => button.click());

    assert.deepEqual(
      [afterAdd, state()],
      [
        ["true", "Favoris1"],
        ["false", "Favoris0"],
      ],
    );
  });
});
