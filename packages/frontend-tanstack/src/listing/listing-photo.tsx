import type { ListingImage } from "@remix-v3-demo/domain/listing/model";

import { ListingImagePlaceholder } from "./listing-image-placeholder.tsx";

export function ListingPhoto({
  image,
  className,
}: {
  image: ListingImage | null;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <ListingImagePlaceholder className="absolute inset-0" />
      {image && (
        <div
          role="img"
          aria-label={image.alt}
          style={{ backgroundImage: `url(${JSON.stringify(image.url)})` }}
          className="absolute inset-0 bg-cover bg-center"
        />
      )}
    </div>
  );
}
