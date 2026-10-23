import * as assert from "remix/assert";
import { describe, it } from "remix/test";

import { moveImage } from "./move-image.ts";

describe("moveImage", () => {
  it("swaps the first two photos when moving the first one down", () => {
    assert.deepEqual(moveImage([1, 2, 3], 0, 1), [2, 1, 3]);
  });
});
