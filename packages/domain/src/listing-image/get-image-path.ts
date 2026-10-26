export const IMMUTABLE_CACHE_SECONDS = String(60 * 60 * 24 * 365);

export function getImagePath(folder: string | number, file: File): string {
  return `${folder}/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
}

export function getMobileImagePath(path: string): string {
  return path.replace(/(\.\w+)$/, "-mobile$1");
}
