# Project Types

Priorities and patterns per kind of product. Read the section that matches the task.

## SaaS apps, CRM, admin panels

Goal: help people get repeated work done quickly and confidently.
- **Navigation**: persistent sidebar (collapsible) or top nav; clear current location; breadcrumbs for deep hierarchies; command palette (⌘K) for power users if scope allows.
- **Information hierarchy**: page title + primary action top-right; filters/search directly above the data they affect; secondary actions in an overflow menu.
- **Tables**: left-align text, right-align numbers (tabular-nums), sticky header, sortable columns with indicators, row hover, bulk selection when actions apply to many rows, pagination or virtualization, column truncation with tooltip/full value on detail. Wrap in `overflow-x-auto` or switch to stacked rows on mobile.
- **Filters**: visible active-filter chips with clear-all; filter state in the URL when practical.
- **Forms**: single column, logical grouping with section headings, inline validation on blur/submit, clear required/optional marking, sticky save bar for long forms, unsaved-changes guard where it matters.
- **Status**: consistent badge vocabulary (e.g. Draft/Active/Paused/Archived) with fixed colors.
- **Density**: 13–14px base, 32–36px controls, compact rows — but keep enough whitespace to group.
- **Detail views**: master-detail (list + side panel) or dedicated page with header summary, tabs, and an activity/timeline.

## Landing pages

Goal: communicate value and move the visitor to one action.
- **Above the fold**: specific headline (what it is + for whom + outcome), one-sentence subhead, primary CTA + optional secondary, real product visual. Avoid vague "Supercharge your workflow" copy.
- **Narrative**: problem → how it works → proof → objections (pricing/FAQ/security) → CTA. Each section has one job.
- **Credibility**: real logos, specific testimonials with names/roles, concrete metrics, security/compliance badges where relevant.
- **CTA repetition**: same primary CTA at natural decision points (after features, after pricing, footer).
- **Visual storytelling**: show the product's UI states, flows, or results rather than abstract illustrations.
- **Performance**: hero image optimized and prioritized; fonts preloaded; minimal JS for static content.
- **Nav**: compact, few links, CTA in the nav; mobile menu that is keyboard-accessible.

## Dashboards & analytics

Goal: let users see what matters and act on it in seconds.
- Start from questions: "What changed? Is anything wrong? What should I do?" Put alerts/exceptions and the most decision-relevant metrics first.
- **Metrics**: value + comparison (vs. previous period, target) + trend; label units and time range explicitly. Don't make every number a giant card.
- **Charts**: choose per question — line for trends over time, bar for comparison across categories, stacked only when part-to-whole matters, tables when exact values matter. Avoid pie/donut beyond 2–4 slices and avoid 3D. Direct labels > legends. Consistent time range control affecting all widgets.
- **Layout**: grid with clear grouping by topic; related data adjacent; drill-down from summary to detail.
- **States**: loading skeletons per widget, empty ("No events in this range"), and error per widget so one failure doesn't blank the page.
- **Density**: data-dense but scannable; generous internal alignment; muted gridlines.

## Portfolios

Goal: make the person's work and personality memorable.
- **Identity**: a distinctive typographic voice and layout is the brand; it's the place to be bolder (oversized type, asymmetric grids, unexpected color) while keeping legibility.
- **Work first**: projects with strong imagery, role, problem, approach, outcome; case-study pages with narrative structure. Quality over quantity — 3–6 strong projects.
- **Intro**: who you are and what you do in one or two sentences — specific, not "passionate creative".
- **Contact**: obvious and frictionless (email link, social links, resume).
- **Motion**: tasteful transitions can express personality; keep them fast and respect reduced motion.
- **Performance**: optimized images (responsive sizes, modern formats, lazy below fold).

## E-commerce

Goal: help people find, trust, and buy.
- **Discovery**: search with suggestions, category navigation, filters (size, price, color, availability) with counts, sorting; filters as a drawer on mobile.
- **Product cards**: large consistent-ratio imagery, name, price (and sale price clearly), rating if available, quick add only if it doesn't hurt clarity.
- **Product page**: gallery with zoom, price, variant selectors with unavailable states, clear add-to-cart, delivery/returns info near the button, reviews, size guide.
- **Trust**: secure checkout cues, return policy, real reviews, contact.
- **Cart/checkout**: editable quantities, transparent totals (shipping, tax), guest checkout, minimal fields, address autocomplete, clear errors, progress indicator.
- **Mobile**: sticky add-to-cart bar; thumb-reachable controls.

## Mobile-first apps & mobile web

Goal: comfortable one-handed use on small screens.
- Touch targets ≥44×44px with ≥8px spacing; primary actions within thumb reach (bottom of screen).
- Navigation: bottom tab bar (3–5 items) or a simple header + back; avoid hamburger for primary destinations.
- Compact layouts: single column, progressive disclosure, bottom sheets for secondary options.
- Inputs: correct `type`/`inputmode`/`autocomplete` attributes to get the right keyboard; avoid tiny selects.
- Respect safe areas (`env(safe-area-inset-*)`), avoid 100vh bugs (`100dvh`).
- Feedback: pressed states, optimistic updates, pull-to-refresh only if native-feeling.
- Test at 320, 375, and 414px widths.
