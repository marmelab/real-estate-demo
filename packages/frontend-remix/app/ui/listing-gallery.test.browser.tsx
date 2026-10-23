import * as assert from "remix/assert";
import { renderToString } from "remix/component/server";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { ListingGallery } from "./listing-gallery.tsx";

const images = [1, 2, 3].map((index) => ({
  url: `/photo-${index}.jpg`,
  alt: `Photo ${index}`,
}));

describe("ListingGallery", () => {
  it("shows the placeholder without images", (t) => {
    let { container, $, cleanup } = render(<ListingGallery images={[]} />);
    t.after(cleanup);

    assert.deepEqual(
      { text: container.textContent, photo: $('[role="img"]') },
      { text: "Photos sur demande", photo: null },
    );
  });

  it("renders no navigation for a single image", (t) => {
    let { $$, cleanup } = render(
      <ListingGallery images={images.slice(0, 1)} />,
    );
    t.after(cleanup);

    assert.deepEqual(
      { radios: $$('input[type="radio"]').length, labels: $$("label").length },
      { radios: 0, labels: 0 },
    );
  });

  it("shows the next photo and its counter on Photo suivante", async (t) => {
    let page = document.createElement("div");
    page.innerHTML = `<style>@layer utilities { .invisible { visibility: hidden; } }</style>${await renderToString(<ListingGallery images={images} />)}`;
    document.body.append(page);
    t.after(() => page.remove());

    page.querySelector<HTMLElement>('label[title="Photo suivante"]')?.click();

    let radios = [...page.querySelectorAll("input")];
    let counters = [...page.querySelectorAll("section > div")];
    assert.deepEqual(
      {
        checked: radios.map((radio) => radio.checked),
        visible: counters.map(
          (counter) => getComputedStyle(counter).visibility,
        ),
      },
      {
        checked: [false, true, false],
        visible: ["hidden", "visible", "hidden"],
      },
    );
  });
});
