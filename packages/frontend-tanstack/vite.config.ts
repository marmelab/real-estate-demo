import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  optimizeDeps: { include: ["@tanstack/react-form"] },
  plugins: [
    devtools(),
    nitro({
      routeRules: {
        "/**": {
          headers: {
            "Strict-Transport-Security":
              "max-age=31536000; includeSubDomains; preload",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
          },
        },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({ compiler: true }),
  ],
});

export default config;
