import { createFileRoute } from "@tanstack/react-router";

import { CitySearchForm } from "../listing/city-search-form.tsx";
import { ListingLanding } from "../listing/listing-landing.tsx";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      {
        title:
          "Immobilier de prestige à Paris, Lyon, Nice et Cannes | Keyhaven",
      },
      {
        name: "description",
        content:
          "Keyhaven sélectionne des appartements et maisons d'exception à vendre à Paris, Lyon, Nice et Cannes.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = Route.useNavigate();

  return (
    <ListingLanding>
      <CitySearchForm
        onSearch={(search) => navigate({ to: "/search", search })}
      />
    </ListingLanding>
  );
}
