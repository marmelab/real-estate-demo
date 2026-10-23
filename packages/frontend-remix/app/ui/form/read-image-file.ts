import { getImageFileError } from "@remix-v3-demo/domain/listing-image/get-image-file-error";

export function readImageFile(
  formData: FormData,
  name: string,
): { file: File; error?: undefined } | { file?: undefined; error: string } {
  let file = formData.get(name);
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Format accepté : JPEG, PNG ou WebP" };
  }
  let error = getImageFileError(file);
  return error ? { error } : { file };
}
