import * as assert from "remix/assert";
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

    assert.equal($$("button").length, 0);
  });

  it("scrolls to the next photo and updates its counter on Photo suivante", async (t) => {
    let style = document.createElement("style");
    style.textContent =
      ".flex { display: flex; } .overflow-x-auto { overflow-x: auto; } .shrink-0 { flex-shrink: 0; } .w-full { width: 100%; }";
    document.head.append(style);
    let { $, act, cleanup } = render(<ListingGallery images={images} />);
    t.after(() => {
      cleanup();
      style.remove();
    });
    let track = $("ul") as HTMLUListElement;
    let scrolled = new Promise((resolve) =>
      track.addEventListener("scrollend", resolve, { once: true }),
    );

    await act(() =>
      ($('button[title="Photo suivante"]') as HTMLElement).click(),
    );
    await act(() => scrolled);

    assert.deepEqual(
      {
        slide: Math.round(track.scrollLeft / track.clientWidth),
        counter: $("p[aria-live]")?.textContent,
        previous: ($('button[title="Photo précédente"]') as HTMLButtonElement)
          .disabled,
      },
      { slide: 1, counter: "2 / 3", previous: false },
    );
  });
});
