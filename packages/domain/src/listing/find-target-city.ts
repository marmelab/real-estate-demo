import type { TargetCity } from "./target-cities.ts";

import { TARGET_CITIES } from "./target-cities.ts";

export function findTargetCity(slug: string): TargetCity | undefined {
  return TARGET_CITIES.find((city) => city.slug === slug);
}
