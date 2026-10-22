import { get, route } from "remix/routes";

export const routes = route({
  assets: get("/assets/*path"),
  home: get("/"),
  search: get("/search"),
  city: get("/immobilier/:city"),
  listing: get("/listings/:listingId"),
  notFound: get("/*path"),
});
