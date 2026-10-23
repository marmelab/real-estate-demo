import * as assert from "remix/assert";
import { render } from "remix/component/test";
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
  it("disables moving the first photo up and the last one down", (t) => {
    let { $$, cleanup } = render(
      <PhotoManager listingId={7} images={images} />,
    );
    t.after(cleanup);

    assert.deepEqual(
      [...$$('button[value="up"], button[value="down"]')].map(
        (button) =>
          `${button.getAttribute("value")}${(button as HTMLButtonElement).disabled ? " disabled" : ""}`,
      ),
      ["up disabled", "down", "up", "down", "up", "down disabled"],
    );
  });

  it("labels the first photo as the cover", (t) => {
    let { $$, cleanup } = render(
      <PhotoManager listingId={7} images={images} />,
    );
    t.after(cleanup);

    assert.deepEqual(
      [...$$("li p.eyebrow")].map((label) => label.textContent),
      ["Photo 1 · Couverture", "Photo 2", "Photo 3"],
    );
  });
});
