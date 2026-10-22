export const COUNT_FACETS: [string, string][] = [1, 2, 3, 4, 5].map((count) => [
  String(count),
  `${count}+`,
]);

export const ENERGY_CLASS_FACETS: [string, string][] = [
  ["A", "A"],
  ["B", "B"],
  ["C", "C"],
  ["D", "D"],
  ["E,F,G", "E-"],
];
