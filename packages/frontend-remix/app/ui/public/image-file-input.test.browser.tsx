import * as assert from "remix/assert";
import { on } from "remix/component";
import { render } from "remix/component/test";
import { describe, it } from "remix/test";

import { ImageFileInput } from "./image-file-input.tsx";

function renderInForm(error?: string) {
  let submits = { count: 0 };
  let result = render(
    <form
      mix={on("submit", (event) => {
        event.preventDefault();
        submits.count++;
      })}
    >
      <ImageFileInput label="Ajouter une photo" name="file" error={error} />
    </form>,
  );
  let input = result.$('input[type="file"]') as HTMLInputElement;
  return { ...result, input, submits };
}

describe("ImageFileInput", () => {
  it("submits its form once when a file is picked", async (t) => {
    let { act, cleanup, input, submits } = renderInForm();
    t.after(cleanup);
    let files = new DataTransfer();
    files.items.add(new File(["x"], "photo.jpg", { type: "image/jpeg" }));

    await act(() => {
      input.files = files.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    assert.equal(submits.count, 1);
  });

  it("submits a desktop and a mobile copy of the photo, each capped in width", async (t) => {
    let submitted = Promise.withResolvers<FormData>();
    let result = render(
      <form
        mix={on("submit", (event) => {
          event.preventDefault();
          submitted.resolve(new FormData(event.currentTarget));
        })}
      >
        <ImageFileInput
          label="Ajouter une photo"
          name="file"
          mobileName="mobile"
        />
      </form>,
    );
    t.after(result.cleanup);
    let canvas = new OffscreenCanvas(4000, 3000);
    canvas.getContext("2d")?.fillRect(0, 0, 4000, 3000);
    let photo = await canvas.convertToBlob();
    let files = new DataTransfer();
    files.items.add(new File([photo], "photo.png", { type: "image/png" }));
    let input = result.$('input[type="file"]') as HTMLInputElement;

    await result.act(() => {
      input.files = files.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    let formData = await submitted.promise;

    let copies = await Promise.all(
      ["file", "mobile"].map(async (name) => {
        let file = formData.get(name) as File;
        let bitmap = await createImageBitmap(file);
        return { type: file.type, width: bitmap.width, height: bitmap.height };
      }),
    );
    assert.deepEqual(copies, [
      { type: "image/webp", width: 1920, height: 1440 },
      { type: "image/webp", width: 640, height: 480 },
    ]);
  });

  it("does not submit when no file is picked", async (t) => {
    let { act, cleanup, input, submits } = renderInForm();
    t.after(cleanup);

    await act(() =>
      input.dispatchEvent(new Event("change", { bubbles: true })),
    );

    assert.equal(submits.count, 0);
  });

  it("shows the upload error", (t) => {
    let { $, cleanup } = renderInForm("Format non pris en charge");
    t.after(cleanup);

    assert.equal(
      $('[aria-live="polite"]')?.textContent,
      "Format non pris en charge",
    );
  });
});
