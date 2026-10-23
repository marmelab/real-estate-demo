import { getDepartmentCode } from "./get-department-code.ts";

describe("getDepartmentCode", () => {
  it.each([
    ["75008", "75"],
    ["06400", "06"],
    ["69003", "69"],
    ["97400", "974"],
    ["20000", "2A"],
    ["20200", "2B"],
  ])(
    "should derive the department of the postal code %s as %s",
    (postalCode, expected) => {
      expect(getDepartmentCode(postalCode)).toBe(expected);
    },
  );
});
