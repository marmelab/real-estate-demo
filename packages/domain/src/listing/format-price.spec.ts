import { formatPrice } from "./format-price.ts";

describe("formatPrice", () => {
  it.each([
    [890000, "sale", "€890,000"],
    [950, "rent", "€950/month"],
  ] as const)(
    "should format %d for %s as %s",
    (price, transactionType, expected) => {
      expect(formatPrice(price, transactionType)).toBe(expected);
    },
  );
});
