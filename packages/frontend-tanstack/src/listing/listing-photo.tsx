import type { ListingImage } from "@remix-v3-demo/domain/listing/model";

import { useState } from "react";

import { ListingImagePlaceholder } from "./listing-image-placeholder.tsx";

export function ListingPhoto({
  image,
  className,
}: {
  image: ListingImage | null;
  className: string;
}) {
  const [isBroken, setIsBroken] = useState(false);

  if (!image || isBroken) {
    return <ListingImagePlaceholder className={className} />;
  }

  return (
    <img
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0) setIsBroken(true);
      }}
      src={image.url}
      alt={image.alt}
      loading="lazy"
      onError={() => setIsBroken(true)}
      className={`object-cover ${className}`}
    />
  );
}
