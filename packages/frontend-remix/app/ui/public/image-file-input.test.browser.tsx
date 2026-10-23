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
