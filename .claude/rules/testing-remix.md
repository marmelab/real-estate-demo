---
paths:
  - "packages/frontend-remix/**"
---

# Remix app testing

- Run tests with `remix test`, never Vitest: `describe`/`it` come from `remix/test`, assertions from `remix/assert`.
- Name a server test `*.test.ts` and a browser test `*.test.browser.tsx`, the suffix choosing where `remix test` runs it.
- Test a route by sending a `Request` through `router.fetch` and asserting the `Response` status, headers and body.
- Test a component with `render` from `remix/component/test`, wrapping each interaction in `act` and registering `cleanup` with `t.after`.
- Where `testing.md` says `toEqual` / `toMatchObject`, use `assert.deepEqual` / `assert.partialDeepEqual`.
