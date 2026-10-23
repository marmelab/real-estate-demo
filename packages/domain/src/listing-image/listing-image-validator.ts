import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const listingImageFileSchema = z
  .file()
  .mime(["image/jpeg", "image/png", "image/webp"])
  .max(MAX_IMAGE_SIZE);

export const listingImageAltSchema = z.string().max(300);
