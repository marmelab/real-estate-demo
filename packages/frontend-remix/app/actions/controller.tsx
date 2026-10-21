import { createController } from "remix/router";

import { assets } from "#assets";

import { Nonce } from "../middleware/security-headers.ts";
import { routes } from "../routes.ts";
import { Document } from "./document.tsx";

export default createController(routes, {
  actions: {
    async assets(context) {
      return (
        (await assets.fetch(context.request)) ??
        new Response("Not Found", { status: 404 })
      );
    },
    home(context) {
      return context.render(<Document nonce={context.get(Nonce)} />);
    },
  },
});
