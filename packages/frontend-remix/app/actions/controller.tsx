import type { RemixNode } from "remix/component";

import { CITY_INTROS } from "@remix-v3-demo/domain/listing/city-intros";
import { findTargetCity } from "@remix-v3-demo/domain/listing/find-target-city";
import { getListingById } from "@remix-v3-demo/domain/listing/get-listing-by-id";
import { getListingSearchTitle } from "@remix-v3-demo/domain/listing/get-listing-search-title";
import { listListings } from "@remix-v3-demo/domain/listing/list-listings";
import { listListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";
import { createController } from "remix/router";

import { assets } from "#assets";

import type { AppContext } from "../router.ts";

import { createServerClient } from "../data/supabase.ts";
import { Nonce } from "../middleware/security-headers.ts";
import { routes } from "../routes.ts";
import { Landing } from "../ui/landing.tsx";
import { ListingView } from "../ui/listing-view.tsx";
import { CityPage } from "./city-page.tsx";
import { Document } from "./document.tsx";
import { NotFoundPage } from "./not-found-page.tsx";
import { SearchPage } from "./search-page.tsx";

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assets.fetch(context.request)) ??
        new Response("Not Found", { status: 404 })
      );
    },
    home(context) {
      return renderPage(context, {
        title:
          "Immobilier de prestige à Paris, Lyon, Nice et Cannes | Keyhaven",
        description:
          "Keyhaven sélectionne des appartements et maisons d'exception à vendre à Paris, Lyon, Nice et Cannes.",
        page: <Landing />,
      });
    },
    async search(context) {
      let query = listListingsQuerySchema.parse(
        Object.fromEntries(context.url.searchParams),
      );
      let result = await listListings(createServerClient(), query);
      let title = getListingSearchTitle(query);
      return renderPage(context, {
        title: `${title} | Keyhaven`,
        description: `${title} : résidences d'exception à vendre, sélectionnées par Keyhaven.`,
        page: <SearchPage query={query} result={result} />,
      });
    },
    async city(context) {
      let city = findTargetCity(context.params.city);
      if (!city) return renderNotFound(context);
      let result = await listListings(createServerClient(), {
        city: city.name,
        page: 1,
      });
      return renderPage(context, {
        title: `Immobilier de prestige à ${city.name} | Keyhaven`,
        description: CITY_INTROS[city.slug],
        page: <CityPage city={city} result={result} />,
      });
    },
    async listing(context) {
      let listingId = Number(context.params.listingId);
      let listing =
        Number.isInteger(listingId) && listingId > 0
          ? await getListingById(createServerClient(), listingId)
          : null;
      if (!listing) {
        return renderPage(context, {
          title: "Bien introuvable | Keyhaven",
          description: "Cette résidence n'existe pas ou n'est plus disponible.",
          page: (
            <NotFoundPage
              title="Bien introuvable"
              message="Cette résidence n'existe pas ou n'est plus disponible."
            />
          ),
          status: 404,
        });
      }
      return renderPage(context, {
        title: `${listing.title} | Keyhaven`,
        description: listing.description.slice(0, 160),
        page: (
          <div class="mx-auto w-full max-w-7xl px-4">
            <ListingView listing={listing} />
          </div>
        ),
      });
    },
    notFound(context) {
      return renderNotFound(context);
    },
  },
});

function renderPage(
  context: AppContext,
  {
    title,
    description,
    page,
    status = 200,
  }: { title: string; description: string; page: RemixNode; status?: number },
) {
  return context.render(
    <Document
      title={title}
      description={description}
      nonce={context.get(Nonce)}
    >
      {page}
    </Document>,
    { status },
  );
}

function renderNotFound(context: AppContext) {
  return renderPage(context, {
    title: "Page introuvable | Keyhaven",
    description: "Cette page n'existe pas ou n'est plus disponible.",
    page: (
      <NotFoundPage
        title="Page introuvable"
        message="Cette page n'existe pas ou n'est plus disponible."
      />
    ),
    status: 404,
  });
}
