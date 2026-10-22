import { render } from "remix/middleware/render";
import { staticFiles } from "remix/middleware/static";
import { createRouter, type MiddlewareContext } from "remix/router";

import { assets } from "#assets";

import controller from "./actions/controller.tsx";
import { securityHeaders } from "./middleware/security-headers.ts";
import { routes } from "./routes.ts";

const securityHeadersMiddleware = securityHeaders();
const renderMiddleware = render({ assets });
export type AppContext = MiddlewareContext<
  [typeof securityHeadersMiddleware, typeof renderMiddleware]
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
    renderMiddleware,
  ],
});

router.map(routes, controller);
