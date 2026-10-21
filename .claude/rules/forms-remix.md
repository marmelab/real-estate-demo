---
paths:
  - "packages/frontend-remix/**"
---

# Forms (Remix)

Read the installed `node_modules/remix/guides/09-forms-and-mutations.md` before building a form.

- Build every form as a native `<form method="post">` with named inputs, so it works with JavaScript disabled.
- Pair the GET and POST actions on one `form()` route: `index` renders the form, `action` parses and saves.
- Validate `context.formData` with the `domain` Zod schema through `s.parseSafe` from `remix/data-schema`, which accepts any Standard Schema.
- Save only `parsed.value`, never raw form data.
- On failure, re-render the form with status 400, the submitted values and `parsed.issues`, never a redirect that loses them.
- Never echo a password back, and ask the user to select files again.
- Show each field's first issue, linked to its input with `aria-describedby`.
- On success, redirect with `303` so a refresh never resubmits.
- Send PATCH, PUT or DELETE through a hidden `_method` input and the `methodOverride()` middleware, installed right after `formData()`.
- Hydrate only the parts that need interactivity (a pending save button), from the action's `public/` directory.
- Missing an input? Add it to `app/ui/form/` once a second form needs it, never a one-off copy.

## Required marker

- A required field carries a trailing "\*" in its label, in text, never color alone.
- A conditional requirement adds the marker the moment it starts to hold and drops it when it stops.
- A group label (date range, typed-contact legend) carries no "\*", its fields do.

## Dependent fields

A field meaningless until a sibling is filled (a unit without its value):

- Hide it until the sibling is set, which needs a hydrated component.
- Mark it required once shown, gated by the same helper as its render.
- Have the schema reject its value while the sibling is missing, since a no-JavaScript submission bypasses the hiding.

## Hidden values

Values hidden by UI state (a field for the other branch of a toggle):

- Keep the hidden input mounted, so switching back restores what the user entered.
- Mark it `disabled` while hidden, so the browser drops it from the submission and it never raises an error the user cannot see.
- Gate the hiding and the `disabled` on one shared helper, never two expressions that happen to agree.
