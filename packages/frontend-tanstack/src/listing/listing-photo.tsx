import type { ListingImage } from "@remix-v3-demo/domain/listing/model";

import { ListingImagePlaceholder } from "./listing-image-placeholder.tsx";

const MOBILE_MEDIA = "(max-width: 767px)";

export function ListingPhoto({
  image,
  className,
  isPriority = false,
}: {
  image: ListingImage | null;
  className: string;
  isPriority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <ListingImagePlaceholder className="absolute inset-0" />
      {image && (
        <picture>
          <source media={MOBILE_MEDIA} srcSet={image.mobileUrl} />
          <img
            src={image.url}
            alt={image.alt}
            loading={isPriority ? undefined : "lazy"}
            fetchPriority={isPriority ? "high" : undefined}
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
      )}
    </div>
  );
}
