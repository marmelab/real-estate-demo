import { findTargetCityByPostalCode } from "./find-target-city-by-postal-code.ts";

describe("findTargetCityByPostalCode", () => {
  it.each([
    ["75008", "Paris"],
    ["75116", "Paris"],
    ["69003", "Lyon"],
    ["06000", "Nice"],
    ["06300", "Nice"],
    ["06400", "Cannes"],
    ["06150", "Cannes"],
  ])("should find the target city of %s", (postalCode, city) => {
    expect(findTargetCityByPostalCode(postalCode)).toEqual(city);
  });

  it.each(["13001", "75021", "0600", "06500"])(
    "should find no target city for %s",
    (postalCode) => {
      expect(findTargetCityByPostalCode(postalCode)).toBeUndefined();
    },
  );
});
