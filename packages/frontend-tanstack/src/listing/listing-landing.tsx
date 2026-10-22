import { TARGET_CITIES } from "@remix-v3-demo/domain/listing/target-cities";
import { Link } from "@tanstack/react-router";

export function ListingLanding({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-obsidian-900 relative flex min-h-[calc(100svh-5rem-1px)] flex-col items-center justify-center px-4 py-16">
      <img
        src="/landing-1600.jpg"
        srcSet="/landing-800.jpg 800w, /landing-1600.jpg 1600w, /landing-2400.jpg 2400w"
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="bg-obsidian-950/75 absolute inset-0" />
      <div className="relative w-full max-w-4xl space-y-6 text-center">
        <p className="eyebrow border-gold bg-obsidian-800 inline-flex items-center gap-2 border px-3 py-1">
          <span className="bg-gold size-1.5" />
          Immobilier de prestige
        </p>
        <h1 className="text-4xl leading-tight font-light tracking-tight text-white sm:text-6xl">
          Résidences urbaines <br />
          <span className="text-gold italic">d'exception</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed font-light tracking-wide text-gray-300">
          Penthouses, hôtels particuliers et villas d'exception à Paris, Lyon,
          Nice et Cannes.
        </p>
        <div className="pt-4">{children}</div>
        <nav aria-label="Nos villes" className="pt-4">
          <ul className="flex flex-wrap justify-center gap-3">
            {TARGET_CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  to="/immobilier/$city"
                  params={{ city: city.slug }}
                  className="button-outline bg-obsidian-950/60"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="absolute right-4 bottom-3 text-xs text-gray-400">
        Photo de{" "}
        <a
          href="https://unsplash.com/fr/@samsonyyc"
          className="hover:text-gold focus-visible:outline-gold underline focus-visible:outline-2"
        >
          Samson
        </a>{" "}
        sur{" "}
        <a
          href="https://unsplash.com"
          className="hover:text-gold focus-visible:outline-gold underline focus-visible:outline-2"
        >
          Unsplash
        </a>
      </p>
    </section>
  );
}
