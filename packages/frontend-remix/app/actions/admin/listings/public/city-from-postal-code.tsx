import type { Handle } from "remix/component";

import { findTargetCityByPostalCode } from "@remix-v3-demo/domain/listing/find-target-city-by-postal-code";
import { clientEntry } from "remix/component";

export const CityFromPostalCode = clientEntry(
  import.meta.url,
  function CityFromPostalCode(
    handle: Handle<{ postalCodeId: string; cityId: string }>,
  ) {
    handle.queueTask(() => {
      let postalCode = document.getElementById(handle.props.postalCodeId);
      let city = document.getElementById(handle.props.cityId);
      if (!(postalCode instanceof HTMLInputElement)) return;
      if (!(city instanceof HTMLSelectElement)) return;
      postalCode.addEventListener(
        "input",
        () => {
          let cityName = findTargetCityByPostalCode(postalCode.value);
          if (cityName) city.value = cityName;
        },
        { signal: handle.signal },
      );
    });
    return () => null;
  },
);
