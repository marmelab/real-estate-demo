import type { TargetCity } from "./target-cities.ts";

import { TARGET_CITIES } from "./target-cities.ts";

const TARGET_CITY_POSTAL_CODES: Record<TargetCity["name"], RegExp> = {
  Paris: /^750(0[1-9]|1\d|20)$|^75116$/,
  Lyon: /^6900[1-9]$/,
  Nice: /^06[0-3]00$/,
  Cannes: /^06(400|150)$/,
};

export function findTargetCityByPostalCode(
  postalCode: string,
): TargetCity["name"] | undefined {
  return TARGET_CITIES.find(({ name }) =>
    TARGET_CITY_POSTAL_CODES[name].test(postalCode),
  )?.name;
}
