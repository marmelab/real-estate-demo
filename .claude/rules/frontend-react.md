---
paths:
  - "**/*.tsx"
  - "**/*.ts"
---

# React

## React Compiler

- This project uses the React Compiler, which memoizes automatically.
- Never add `useCallback`, `useMemo`, or `React.memo`.
- Reach for them only in the rare, measured case the compiler can't cover, with a comment saying why.

## Components

- Small function components, one responsibility each.
- Derive values during render instead of mirroring props/state into more state.
- Use `useEffect` only to sync with external systems (subscriptions, the DOM, non-React widgets), never to react to prop changes or fetch data.
- Give lists stable identity-based keys, never the array index.
- Ask only for the props a component uses, passing the specific fields rather than a whole object it barely reads.

## App shell

- Each app owns one shared shell in the root route: a `<header>` landmark and a `<main>` landmark wrapping the route `Outlet`.
- Keep `<main>` full-bleed (`w-full`), never centered or capped by the shell (no `mx-auto`/`max-w-*`).
- `admin` pages use that full width; only a `frontend` page may add its own width wrapper (`mx-auto w-full max-w-6xl`).
- Pages MUST NOT declare their own `<header>`/`<main>`: one of each landmark per document.

## State management

- Server state: @tanstack/react-query, the source of truth, never duplicated into client state.
- Create the `QueryClient` in `getRouter`, never at module scope, so SSR requests never share a cache.
- `setupRouterSsrQueryIntegration` provides and hydrates the client: never add a second provider or dehydrate by hand.
- Client state: React Context with useState/useReducer.
- URL state: search params and route segments.
- Form state: @tanstack/react-form via `useAppForm` (see [forms-react.md](forms-react.md)).
- A value not submitted to the API is derivable: keep it in component state, re-derived from the form values on mount.
- Never reach for a global state manager; keep state local and lift to Context only when genuinely shared across distant components.

## Extract hooks

- When a component accumulates complex state logic (several related `useState`s, a `useReducer`, effects, derived values), extract it into a custom hook so the component reads as what it renders.

## URL as state

- Persist shareable state in the URL (filters, sort order, pagination, active tab, search query): if refreshing should restore it, it belongs in the URL.

## Component composition

- Container components own data loading and side effects.
- Presentational components receive props and render UI, staying pure.
- Use compound components (parent owns state, children consume via context) rather than prop drilling for complex widgets.

## Data fetching

- Fetch independent data in parallel, avoiding parent-child waterfalls.
- Use @tanstack/react-query for caching, optimistic updates, and revalidation rather than rolling your own.
- For optimistic updates, snapshot state, apply immediately, roll back on failure, and show visible error feedback on rollback.

## Consuming Supabase

Each entity gets one react-query hook per operation (`useListings`, `useCreateListing`), which:

- calls the `domain` data-access function with the app's Supabase client, never supabase-js directly
- builds the request from the domain types

## Data tables

- Render datagrids with `@tanstack/react-table` (headless) over a native `<table>` styled with Tailwind.
- Let the library own table state (sorting, pagination, selection, column visibility).
- For server-paginated tables use manual pagination and keep page and page size in the URL.
