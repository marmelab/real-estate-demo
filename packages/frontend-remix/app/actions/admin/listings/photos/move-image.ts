export function moveImage(ids: number[], from: number, to: number): number[] {
  return ids.toSpliced(from, 1).toSpliced(to, 0, ...ids.slice(from, from + 1));
}
