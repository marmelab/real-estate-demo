export function getImagePath(folder: string | number, file: File): string {
  return `${folder}/${crypto.randomUUID()}.${file.type.split("/")[1]}`;
}
