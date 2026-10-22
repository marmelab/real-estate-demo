import { formatPrice } from "./format-price.ts";

describe("formatPrice", () => {
  it("should format the price in euros with French digit grouping", () => {
    expect(formatPrice(890000)).toBe("890\u202f000\u00a0€");
  });
});
