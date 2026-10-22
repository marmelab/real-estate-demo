import { formatAddress } from "./format-address.ts";

describe("formatAddress", () => {
  it.each([
    ["12 rue de Turenne", "12 rue de Turenne, 75004 Paris"],
    ["", "75004 Paris"],
  ])("should format the street address %j as %j", (address, expected) => {
    expect(formatAddress({ address, postalCode: "75004", city: "Paris" })).toBe(
      expected,
    );
  });
});
