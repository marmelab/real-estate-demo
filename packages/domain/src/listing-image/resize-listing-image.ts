/// <reference lib="dom" />

const DESKTOP_WIDTH = 1920;
const MOBILE_WIDTH = 640;
const QUALITY = 0.8;

export type ResizedListingImage = { desktop: File; mobile: File };

async function resize(bitmap: ImageBitmap, maxWidth: number): Promise<File> {
  const width = Math.min(bitmap.width, maxWidth);
  const height = Math.round((bitmap.height * width) / bitmap.width);
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  const webp = await canvas.convertToBlob({
    type: "image/webp",
    quality: QUALITY,
  });
  const blob =
    webp.type === "image/webp"
      ? webp
      : await canvas.convertToBlob({ type: "image/jpeg", quality: QUALITY });
  return new File([blob], `${width}w.${blob.type.split("/")[1]}`, {
    type: blob.type,
  });
}

export async function resizeListingImage(
  file: File,
): Promise<ResizedListingImage> {
  const bitmap = await createImageBitmap(file);
  try {
    const [desktop, mobile] = await Promise.all([
      resize(bitmap, DESKTOP_WIDTH),
      resize(bitmap, MOBILE_WIDTH),
    ]);
    return { desktop, mobile };
  } finally {
    bitmap.close();
  }
}
