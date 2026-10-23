import { listingImageFileSchema } from "./listing-image-validator.ts";

export function getImageFileError(file: File): string | undefined {
  const result = listingImageFileSchema.safeParse(file);
  if (result.success) return undefined;
  return result.error.issues.some((issue) => issue.code === "too_big")
    ? "La photo dépasse 5 Mo"
    : "Format accepté : JPEG, PNG ou WebP";
}
