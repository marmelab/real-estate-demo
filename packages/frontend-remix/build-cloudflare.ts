import * as fs from "node:fs/promises";

import { assets, scriptEntry } from "./app/assets.ts";
import { SECURITY_HEADERS } from "./app/middleware/security-headers.ts";

const { imports, scopes = {} } = scriptEntry.importMap;
const urls = new Set([
  scriptEntry.href,
  ...scriptEntry.preloads,
  ...Object.values(imports),
  ...Object.values(scopes).flatMap((scope) => Object.values(scope)),
]);

const files: Record<string, { body: string; type: string }> = {};
for (const url of urls) {
  const request = new Request(new URL(url, "http://localhost"));
  const response = await assets.fetch(request);
  if (!response?.ok) throw new Error(`Cannot build asset ${url}`);
  files[new URL(request.url).pathname] = {
    body: await response.text(),
    type: response.headers.get("Content-Type") ?? "text/javascript",
  };
}

await fs.rm("dist", { recursive: true, force: true });
await fs.cp("public", "dist/client", { recursive: true });
await fs.writeFile(
  "dist/client/_headers",
  [
    "/*",
    ...Object.entries(SECURITY_HEADERS).map(
      ([name, value]) => `  ${name}: ${value}`,
    ),
    "",
  ].join("\n"),
);
await fs.writeFile(
  "dist/assets.js",
  `const files = ${JSON.stringify(files)};

export const scriptEntry = ${JSON.stringify(scriptEntry)};

export const assets = {
  async fetch(request) {
    const file = files[new URL(request.url).pathname];
    return file
      ? new Response(file.body, { headers: { "Content-Type": file.type } })
      : null;
  },
  async getScriptEntry(id) {
    throw new Error(\`clientEntry() \${id} is not pre-built for Cloudflare\`);
  },
};
`,
);
