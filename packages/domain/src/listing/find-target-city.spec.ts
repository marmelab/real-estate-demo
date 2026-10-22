import { findTargetCity } from "./find-target-city.ts";

describe("findTargetCity", () => {
  it.each([
    ["paris", { slug: "paris", name: "Paris" }],
    ["marseille", undefined],
  ])("should find the target city %s", (slug, expected) => {
    expect(findTargetCity(slug)).toEqual(expected);
  });
});
