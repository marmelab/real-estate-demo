import { del, form, get, post, route } from "remix/routes";

export const routes = route({
  assets: get("/assets/*path"),
  home: get("/"),
  search: get("/search"),
  city: get("/immobilier/:city"),
  listing: get("/listings/:listingId"),
  favorites: get("/favoris"),
  admin: route("/admin", {
    index: get("/"),
    logout: post("/logout"),
    login: form("/login"),
    acceptInvite: form("/accept-invite"),
    profile: {
      index: get("/profile"),
      action: post("/profile"),
      photoPage: get("/profile/photo"),
      photo: post("/profile/photo"),
    },
    listings: {
      index: get("/listings"),
      new: form("/listings/new"),
      edit: {
        index: get("/listings/:listingId"),
        action: post("/listings/:listingId"),
        destroy: del("/listings/:listingId"),
      },
      photos: {
        index: get("/listings/:listingId/photos"),
        create: post("/listings/:listingId/photos"),
        show: get("/listings/:listingId/photos/:imageId"),
        update: post("/listings/:listingId/photos/:imageId"),
      },
    },
    agents: {
      index: get("/agents"),
      invite: post("/agents"),
      edit: {
        index: get("/agents/:agentId"),
        action: post("/agents/:agentId"),
        destroy: del("/agents/:agentId"),
      },
    },
  }),
  notFound: get("/*path"),
});
