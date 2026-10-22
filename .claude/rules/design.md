---
paths:
  - "packages/frontend-*/**"
---

# Design

- Keyhaven is a high-end agency: every page follows a flat obsidian and gold look, never the default Tailwind grays or blue.
- The palette and shared classes (`eyebrow`, `field-label`, `field-input`, `button-gold`, `button-outline`) live in the app stylesheet: reuse them, never hard-code a hex color in a component.
- Use the system sans-serif font, never a web font.
- Square corners and 1px borders, no rounded cards or drop shadows.
- Labels and eyebrows are uppercase with wide tracking, at least 12px (`text-xs`).
- Text keeps a 4.5:1 contrast on its background; check a new color pair before shipping it.
- A listing without a photo shows the "Photos sur demande" placeholder, never a broken image.
- Credit third-party photos on the page (e.g. Unsplash author and link).
