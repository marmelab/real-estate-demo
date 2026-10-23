import { configureZodErrors } from "@remix-v3-demo/domain/form/configure-zod-errors";
import { cop } from "remix/middleware/cop";
import { formData } from "remix/middleware/form-data";
import { methodOverride } from "remix/middleware/method-override";
import { render } from "remix/middleware/render";
import { staticFiles } from "remix/middleware/static";
import { createRouter, type MiddlewareContext } from "remix/router";

import { assets } from "#assets";

import adminAcceptInviteController from "./actions/admin/accept-invite/controller.tsx";
import adminAgentsController from "./actions/admin/agents/controller.tsx";
import adminAgentEditController from "./actions/admin/agents/edit/controller.tsx";
import adminController from "./actions/admin/controller.tsx";
import adminListingsController from "./actions/admin/listings/controller.tsx";
import adminListingEditController from "./actions/admin/listings/edit/controller.tsx";
import adminListingNewController from "./actions/admin/listings/new/controller.tsx";
import adminListingPhotosController from "./actions/admin/listings/photos/controller.tsx";
import adminLoginController from "./actions/admin/login/controller.tsx";
import adminProfileController from "./actions/admin/profile/controller.tsx";
import controller from "./actions/controller.tsx";
import { securityHeaders } from "./middleware/security-headers.ts";
import { routes } from "./routes.ts";

configureZodErrors();

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

const securityHeadersMiddleware = securityHeaders();
const formDataMiddleware = formData({ maxFileSize: MAX_UPLOAD_SIZE });
const renderMiddleware = render({ assets });
export type AppContext = MiddlewareContext<
  [
    typeof securityHeadersMiddleware,
    typeof formDataMiddleware,
    typeof renderMiddleware,
  ]
>;

declare module "remix" {
  interface RouterTypes {
    context: AppContext;
  }
}

export const router = createRouter<AppContext>({
  middleware: [
    securityHeadersMiddleware,
    staticFiles("./public", { index: false, cacheControl: "no-cache" }),
    cop(),
    formDataMiddleware,
    methodOverride(),
    renderMiddleware,
  ],
});

router.map(routes, controller);
router.map(routes.admin, adminController);
router.map(routes.admin.login, adminLoginController);
router.map(routes.admin.acceptInvite, adminAcceptInviteController);
router.map(routes.admin.profile, adminProfileController);
router.map(routes.admin.listings, adminListingsController);
router.map(routes.admin.listings.new, adminListingNewController);
router.map(routes.admin.listings.edit, adminListingEditController);
router.map(routes.admin.listings.photos, adminListingPhotosController);
router.map(routes.admin.agents, adminAgentsController);
router.map(routes.admin.agents.edit, adminAgentEditController);
