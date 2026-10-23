import type { ListingInput } from "./listing-validator.ts";

import { getDepartmentCode } from "./get-department-code.ts";

export function toListingRow(input: ListingInput): Record<string, unknown> {
  return {
    title: input.title,
    description: input.description,
    property_type: input.propertyType,
    price: input.price,
    surface_area: input.surfaceArea,
    land_area: input.landArea,
    rooms: input.rooms,
    bedrooms: input.bedrooms,
    energy_class: input.energyClass,
    address: input.address,
    postal_code: input.postalCode,
    city: input.city,
    department_code: getDepartmentCode(input.postalCode),
    latitude: input.latitude,
    longitude: input.longitude,
    published: input.published,
    agent_id: input.agentId,
  };
}
