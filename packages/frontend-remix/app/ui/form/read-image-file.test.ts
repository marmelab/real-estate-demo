import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { readImageFile } from "./read-image-file.ts";

function formDataWith(file: File): FormData {
  let formData = new FormData();
  formData.set("file", file);
  return formData;
}

describe("readImageFile", () => {
  let refusedCases: [string, File, string][] = [
    [
      "a file that is not an image",
      new File(["text"], "notes.txt", { type: "text/plain" }),
      "Format accepté : JPEG, PNG ou WebP",
    ],
    [
      "an image over 5 MB",
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.jpg", {
        type: "image/jpeg",
      }),
      "La photo dépasse 5 Mo",
    ],
  ];
  for (let [label, file, error] of refusedCases) {
    it(`refuses ${label}`, () => {
      assert.deepEqual(readImageFile(formDataWith(file), "file"), { error });
    });
  }
});
