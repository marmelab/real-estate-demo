import * as assert from "remix/assert";
import { renderToString } from "remix/component/server";
import { describe, it } from "remix/test";

import { PhotoManager } from "./photo-manager.tsx";

const images = [1, 2, 3].map((id) => ({
  id,
  path: `7/${id}.jpg`,
  position: id - 1,
  alt: `Photo ${id}`,
  url: `/${id}.jpg`,
}));

describe("PhotoManager", () => {
  it("disables moving the first photo up and the last one down", async () => {
    let html = await renderToString(
      <PhotoManager listingId={7} images={images} />,
    );

    let moves = [...html.matchAll(/value="(up|down)"( disabled)?/g)].map(
      ([, intent, disabled]) => `${intent}${disabled ? " disabled" : ""}`,
    );
    assert.deepEqual(moves, [
      "up disabled",
      "down",
      "up",
      "down",
      "up",
      "down disabled",
    ]);
  });
});
