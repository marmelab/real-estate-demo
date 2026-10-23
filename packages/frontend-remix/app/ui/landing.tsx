import { TARGET_CITIES } from "@remix-v3-demo/domain/listing/target-cities";
import { Search } from "lucide";

import { routes } from "../routes.ts";
import { Icon } from "./icon.tsx";

export function Landing() {
  return () => (
    <section class="bg-obsidian-900 relative flex min-h-[calc(100svh-5rem-1px)] flex-col items-center justify-center px-4 py-16">
      <img
        src="/landing-1600.jpg"
        srcSet="/landing-800.jpg 800w, /landing-1600.jpg 1600w, /landing-2400.jpg 2400w"
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        class="absolute inset-0 size-full object-cover"
      />
      <div class="bg-obsidian-950/75 absolute inset-0" />
      <div class="relative w-full max-w-4xl space-y-6 text-center">
        <p class="eyebrow border-gold bg-obsidian-800 inline-flex items-center gap-2 border px-3 py-1">
          <span class="bg-gold size-1.5" />
          Immobilier de prestige
        </p>
        <h1 class="text-4xl leading-tight font-light tracking-tight text-white sm:text-6xl">
          Résidences urbaines <br />
          <span class="text-gold italic">d'exception</span>
        </h1>
        <p class="mx-auto max-w-2xl text-sm leading-relaxed font-light tracking-wide text-gray-300">
          Penthouses, hôtels particuliers et villas d'exception à Paris, Lyon,
          Nice et Cannes.
        </p>
        <div class="pt-4">
          <CitySearchForm />
        </div>
        <nav aria-label="Nos villes" class="pt-4">
          <ul class="flex flex-wrap justify-center gap-3">
            {TARGET_CITIES.map((city) => (
              <li key={city.slug}>
                <a
                  href={routes.city.href({ city: city.slug })}
                  class="button-outline bg-obsidian-950/60"
                >
                  {city.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p class="absolute right-4 bottom-3 text-xs text-gray-400">
        Photo de{" "}
        <a
          href="https://unsplash.com/fr/@samsonyyc"
          class="hover:text-gold focus-visible:outline-gold underline focus-visible:outline-2"
        >
          Samson
        </a>{" "}
        sur{" "}
        <a
          href="https://unsplash.com"
          class="hover:text-gold focus-visible:outline-gold underline focus-visible:outline-2"
        >
          Unsplash
        </a>
      </p>
    </section>
  );
}

function CitySearchForm() {
  return () => (
    <form
      method="get"
      action={routes.search.href()}
      role="search"
      class="border-gold bg-obsidian-800 mx-auto flex max-w-3xl flex-col gap-4 border p-4 text-left sm:flex-row sm:items-end sm:p-6"
    >
      <label class="field-label flex-1">
        Ville
        <input
          name="city"
          autoComplete="address-level2"
          placeholder="Paris, Lyon, Nice, Cannes"
          class="field-input"
        />
      </label>
      <label class="field-label sm:w-48">
        Budget max (€)
        <input
          name="maxPrice"
          inputMode="numeric"
          placeholder="Indifférent"
          class="field-input"
        />
      </label>
      <button type="submit" class="button-gold">
        <Icon icon={Search} class="size-4" />
        Rechercher
      </button>
    </form>
  );
}
