# Review Checklist

Run this after the first working version, against the *rendered* UI whenever possible. Fix the highest-impact problems first, then re-render and re-check.

## How to look

1. Render at 375px, 768px, and 1440px (use `scripts/ui_audit.mjs` or the environment's browser tools). Also try 320px if the audience is mobile-heavy.
2. Look at each screenshot as a whole first (squint test): what draws the eye first, second, third? Does that match the intended priority?
3. Then inspect details region by region.
4. Interact: tab through, hover, open menus/dialogs, submit forms empty and invalid, trigger loading/empty/error states (temporarily force them if needed).
5. Check the console for errors and warnings (hydration, key, a11y).

## Hierarchy & composition
- [ ] The primary action/information is the most prominent thing on the screen.
- [ ] There is a clear reading order; nothing competes for attention without reason.
- [ ] Sections differ in structure according to their purpose (not all identical card grids).
- [ ] Nothing exists only as decoration without a purpose you can name.

## Spacing & alignment
- [ ] Spacing uses the scale; similar gaps are equal across the page.
- [ ] Related elements are grouped tighter than unrelated ones.
- [ ] Left edges align across sections; text baselines align in rows.
- [ ] No awkward empty areas or cramped clusters; content width is appropriate.

## Typography
- [ ] Sizes come from the scale; no stray one-off sizes.
- [ ] Headings, body, labels, and metadata are clearly distinguishable.
- [ ] Line length ≤ ~75ch for prose; comfortable line height.
- [ ] Numbers in tables/metrics use tabular figures and are right-aligned.
- [ ] No widows/orphans on prominent headings where easily fixable (`text-balance`).

## Color & contrast
- [ ] Palette is restrained; accent used consistently for the same meanings.
- [ ] Text contrast ≥ 4.5:1 (≥ 3:1 large); borders/icons/focus rings ≥ 3:1.
- [ ] Semantic colors used only for status, always paired with text/icon.
- [ ] Dark mode (if supported) checked separately.

## Components & states
- [ ] Buttons, inputs, cards, etc. are consistent in height, radius, and style.
- [ ] One clear primary action per region; destructive actions are distinct.
- [ ] Hover, focus-visible, active, disabled, loading states exist and look right.
- [ ] Empty, loading, and error states exist for every async/data view.
- [ ] Forms validate with clear messages; submit shows progress; no double submit.

## Responsive
- [ ] No horizontal scroll at 320–375px.
- [ ] Navigation works on mobile (menu opens/closes, keyboard accessible).
- [ ] Tables scroll or restack; images scale without distortion.
- [ ] Touch targets ≥ 44px on mobile.
- [ ] Large-screen layout doesn't stretch text lines or leave a lonely narrow column.

## Content robustness
- [ ] Long names/titles/numbers truncate or wrap gracefully.
- [ ] Zero, one, and many items all look intentional.
- [ ] Copy is realistic and specific; no lorem ipsum or "Feature 1".

## Accessibility & semantics
- [ ] Landmarks and a logical heading order.
- [ ] Every control reachable and operable by keyboard; focus always visible.
- [ ] Icon-only buttons labelled; images have appropriate alt.
- [ ] Dialogs trap focus, close on Escape, return focus.
- [ ] Reduced-motion respected.

## Engineering
- [ ] No console errors or warnings; build/typecheck/lint pass if available.
- [ ] Reused existing components and tokens; no duplicate primitives.
- [ ] No unused dependencies added; no dead/fake controls.
- [ ] Existing functionality still works.

## Against a reference (when one was given)
- [ ] Layout proportions, spacing, type sizes/weights, colors, radii match.
- [ ] Differences are intentional and explained (e.g. contrast fix).
- [ ] Compared side by side with the rendered output before claiming a match.

## Reporting
State what you verified visually and how (widths, interactions), what you verified only in code, and anything left stubbed or unverified.
