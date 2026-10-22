export const TARGET_CITIES = [
  { slug: "paris", name: "Paris" },
  { slug: "lyon", name: "Lyon" },
  { slug: "nice", name: "Nice" },
  { slug: "cannes", name: "Cannes" },
] as const;

export type TargetCity = (typeof TARGET_CITIES)[number];
