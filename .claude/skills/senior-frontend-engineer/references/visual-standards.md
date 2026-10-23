# Visual Standards

Concrete scales and rules. Adapt values to the project's existing system when one exists.

## Contents
1. Tokens
2. Spacing
3. Typography scale
4. Color usage
5. Radius, borders, elevation
6. Component state matrix
7. Motion
8. Icons and imagery
9. Copy

---

## 1. Tokens

Define once, consume everywhere. Example with CSS variables (works with Tailwind v3 `theme.extend` or Tailwind v4 `@theme`):

```css
:root {
  --bg: 0 0% 100%;
  --surface: 240 5% 98%;
  --border: 240 6% 90%;
  --text: 240 10% 10%;
  --text-muted: 240 4% 42%;
  --accent: 221 83% 45%;
  --accent-fg: 0 0% 100%;
  --success: 142 72% 29%;
  --warning: 32 95% 40%;
  --danger: 0 72% 46%;
  --radius-sm: 4px;
  --radius: 8px;
  --radius-lg: 12px;
}
.dark { /* redefine the same names */ }
```

Name tokens by role (`--text-muted`, `--surface`), not by value (`--gray-500`), so dark mode and rebrands are one-file changes. If the project uses shadcn/ui, its `--background`, `--foreground`, `--muted`, `--primary`… tokens are the system — use them.

## 2. Spacing

- 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- Proximity communicates grouping: label→input 6–8px; field→field 16–20px; group→group 32–48px; section→section 64–128px (marketing) or 24–40px (app).
- Card/panel padding: 16–24px in apps, 24–40px in marketing.
- Use `gap` on flex/grid instead of margins on children.
- Content width: app content ~1200–1440px max; marketing text ~1100–1280px container; prose ~65ch.
- Vertical rhythm: keep section paddings consistent; inconsistent gaps are the #1 "amateur" tell.

## 3. Typography scale

A practical app scale (px): 12 (meta), 13/14 (UI body, tables), 16 (emphasized body), 20 (section title), 24 (page title), 30–36 (rare).

A practical marketing scale (px): 14 (meta), 16–18 (body), 20–24 (lead), 30–36 (h3), 40–48 (h2), 56–72 (h1, desktop only; scale down with `clamp()` on mobile).

- Pair each size with a line-height: small/body 1.5–1.6; headings 1.1–1.25.
- Text color levels: primary (~90–95% contrast), secondary/muted, disabled. Three levels is enough.
- Labels/eyebrows: 12–13px, medium weight; uppercase + tracking only if it fits the direction.
- Avoid: more than ~7 sizes, more than 3 weights, centered paragraphs longer than 2–3 lines, justified text.

## 4. Color usage

- ~90% of the UI is neutral. Accent marks primary actions, current selection, focus, and key data series.
- One primary button per view/region. Secondary = outline or subtle fill. Tertiary = ghost/text. Destructive = danger color, ideally behind confirmation.
- Status badges: tinted bg (≈10–15% of the hue) + strong text (700-ish) + optional dot/icon.
- Charts: one accent for the focus series, neutrals for comparison; a categorical palette only when categories truly need distinction. Label directly when possible.
- Contrast minimums: 4.5:1 text, 3:1 large text (≥24px or ≥18.66px bold), 3:1 for UI component boundaries and focus indicators.

## 5. Radius, borders, elevation

- Pick a scale and assign by component size: inputs/buttons `--radius` (6–8px), cards/dialogs `--radius-lg` (8–12px), tags `--radius-sm` or full pill. Nested elements use a smaller radius than their container (inner = outer − padding).
- Choose a primary separation strategy: hairline borders (1px, low-contrast) **or** background contrast **or** soft shadows. Mixing all three on one surface is noise.
- Elevation levels: flat (page), raised (cards: border or very soft shadow), overlay (popover/menu/dialog: clearer shadow + border). Shadows should be soft and low-opacity, e.g. `0 1px 2px rgb(0 0 0 / .05), 0 4px 12px rgb(0 0 0 / .06)`.

## 6. Component state matrix

Every interactive component needs these, visually distinct and consistent across the system:

| State | Treatment |
|---|---|
| Default | Clear affordance (looks clickable/typeable) |
| Hover | Subtle bg/border shift; cursor pointer for actions |
| Focus-visible | 2px ring in accent with 2px offset (or inset), ≥3:1 contrast; never `outline: none` without replacement |
| Active/pressed | Slightly darker or scale(0.98) |
| Disabled | Reduced contrast + `disabled`/`aria-disabled`; not just opacity on a still-clickable element |
| Loading | Spinner or skeleton in place; button keeps its width; prevent double submit |
| Error | Danger border + message below the field, linked via `aria-describedby` |
| Selected/current | Accent indicator + `aria-current`/`aria-selected` |

Data views also need: **empty** (explain what goes here + primary action to create the first item), **loading** (skeletons matching final layout to avoid shift), **error** (what happened + retry), **partial/long** (truncation, pagination, or virtualization).

Sizes: buttons/inputs typically 32–36px height in dense apps, 40–44px in consumer/marketing; touch targets ≥44×44px on mobile.

## 7. Motion

- Purpose: feedback (press, hover), continuity (expand, open, reorder), orientation (page/route change). Not decoration.
- Durations: micro 100–150ms, small UI 150–250ms, larger panels 250–350ms. Ease-out for entering, ease-in for exiting.
- Animate `transform` and `opacity`; avoid animating layout properties.
- Wrap non-essential motion in `@media (prefers-reduced-motion: no-preference)` or Tailwind `motion-safe:`.

## 8. Icons and imagery

- One icon set, one stroke width, consistent size per context (16px inline UI, 20px nav, 24px feature).
- Icons support labels; icon-only buttons need `aria-label` and ideally a tooltip.
- Use real product screenshots, photography, or the project's assets. If you must use placeholders, make them honest (neutral blocks with dimensions noted), not fake gradients pretending to be content.
- Reserve aspect ratios (`aspect-[16/9]`, width/height attrs) to prevent layout shift.

## 9. Copy

- Specific beats generic: "Send invoice" not "Submit"; "No customers match 'acme'" not "No data".
- Realistic sample data: plausible names, varied lengths, real-looking numbers/dates, a mix of statuses — including edge cases (long names, zero values) so the layout is tested.
- Sentence case for UI labels and headings unless the brand dictates otherwise.
- Button labels are verbs; headings say what the section is for.
