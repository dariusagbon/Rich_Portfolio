# Design Direction

How to pick a visual direction that fits the product instead of defaulting to a template.

## Contents
1. Deriving a direction
2. Typography starting points
3. Color starting points
4. Layout ideas beyond hero + three cards
5. Anti-patterns and what to do instead
6. Using reference products well

---

## 1. Deriving a direction

Start from the product and audience, not from a style you like.

| Question | Example answer → design consequence |
|---|---|
| Who uses it, how often? | Ops engineers, all day → dense, low-chroma, keyboard-first, small type, minimal motion |
| What's the emotional register? | Wedding photographer portfolio → generous whitespace, editorial serif, imagery dominant |
| What's the primary action? | Start free trial → one accent color reserved for that CTA, repeated at natural decision points |
| What's the content shape? | Tabular records → tables with sticky headers, not card grids |
| Existing brand? | Brand teal + Söhne → derive neutral ramp from teal's hue, use brand type |

Write the direction as 2–3 adjectives plus concrete decisions:

> **Direction: "precise, quiet, technical."** Geist Sans 14px base / Geist Mono for IDs and numbers. Zinc neutrals, single blue-600 accent for primary actions and selection. 1px borders as separators, no shadows except popovers. Radius 6px. 240px left sidebar collapsing to a sheet below 1024px. 120–160ms ease-out transitions on hover/press only.

> **Direction: "warm, editorial, confident."** Fraunces display headings, Inter body at 17px/1.6. Off-white #FAF8F5 paper, near-black #1C1917 ink, terracotta #C2410C accent used sparingly. Asymmetric 12-col grid, large project imagery, no cards — content sits on the page. Minimal radius (2px). Subtle fade/translate on scroll-in, disabled under reduced motion.

The decisions must reinforce each other. Mixing a brutalist grid with glassmorphic cards and playful bouncy animations produces incoherence.

## 2. Typography starting points

Pick by character, then verify it's available (Google Fonts, `next/font`, project assets, or system stack).

| Character | Pairing ideas |
|---|---|
| Neutral product UI | Inter, Geist, IBM Plex Sans, system-ui stack |
| Technical / developer | Geist + Geist Mono, JetBrains Mono for code/data, IBM Plex Sans + Plex Mono |
| Editorial / premium | Fraunces, Newsreader, Instrument Serif, or Playfair (display) + Inter/Source Sans (body) |
| Friendly / consumer | Plus Jakarta Sans, DM Sans, Manrope, Nunito Sans (restrained) |
| Bold / brand-forward | Space Grotesk, Satoshi, Clash Display, Archivo (display) + neutral body |
| Swiss / minimal | Inter Tight, Helvetica-style system, Neue Haas-like grotesks |

Rules of thumb:
- One family is usually enough for product UI; two for marketing/editorial (display + body). Three is rarely justified.
- Use `font-variant-numeric: tabular-nums` for numbers in tables, metrics, and prices.
- Display headings: tighter tracking (−0.01 to −0.03em) and line-height ~1.05–1.2. Body: line-height 1.5–1.7, measure 60–75 characters (`max-w-prose` / ~65ch).
- Weights: typically 400, 500, 600 (and maybe 700 for display). Avoid 300 for body text on screens.

## 3. Color starting points

A palette = neutral ramp (~10 steps) + 1 accent (sometimes 2) + semantic set. Choose the neutral's temperature deliberately:

| Neutral | Feel | Pairs with |
|---|---|---|
| Zinc / neutral gray | Technical, crisp | Blue, emerald, orange accents |
| Stone / warm gray | Editorial, human | Terracotta, olive, deep green |
| Slate / cool blue-gray | Corporate, calm | Teal, indigo, amber |
| Tinted (neutral with a hint of the brand hue) | Cohesive, custom | The brand hue itself |

Accents worth considering besides indigo/violet: deep green (#15803D), cobalt (#1D4ED8), vermilion (#E5484D), amber (#B45309), teal (#0F766E), ink-black accent (monochrome UI where the "accent" is black/white inversion).

Semantic: success (green), warning (amber), danger (red), info (blue). Use subtle tinted backgrounds + strong text/icon for badges and alerts; never rely on color alone — pair with icon or text.

Dark mode: not just inverted. Use dark gray surfaces (#0A0A0B–#18181B), raise elevation with lighter surfaces rather than shadows, reduce accent saturation slightly, keep text at ~90% white for body and ~60% for muted.

Always check contrast (WCAG AA): 4.5:1 for body text, 3:1 for large text, icons, and input borders.

## 4. Layout ideas beyond hero + three cards

For marketing pages, vary section structure based on what each section must communicate:
- **Product-led hero**: headline left, real product screenshot/UI right or below, bleeding off the edge.
- **Split statement**: large typographic statement + concise supporting column.
- **Feature walkthrough**: alternating text/visual rows, each showing a real UI state, not an icon.
- **Bento grid** (only when features have different importance): mixed-size tiles where size reflects weight.
- **Comparison / before-after**: table or side-by-side showing the problem vs. solution.
- **Proof**: customer logos in a quiet row, one strong quote with name/title/photo, concrete metrics.
- **Long-form editorial**: single column with pull quotes and inline media.
- **Pricing**: table that makes the recommended plan obvious without neon glow.

For apps: sidebar + content, top nav + content, master-detail (list + panel), command-palette-centric, canvas + inspector, wizard/stepper.

## 5. Anti-patterns and what to do instead

| Generic default | Why it fails | Better |
|---|---|---|
| Purple→blue gradient hero, glowing blobs | Instantly reads "AI template"; competes with content | Solid or subtly tinted background; let a real product visual carry the hero |
| Glassmorphism cards on gradient | Low contrast, muddy, dated | Solid surfaces with a 1px border or soft shadow |
| Three identical icon-title-text cards | Says nothing specific; every feature looks equally (un)important | Show the product doing the thing; vary layout by importance |
| Everything `rounded-2xl` + pills | Toy-like, loses structure | One modest radius scale (e.g. 6/8/12), pills only for tags/status |
| Heavy shadows on every card | Visual noise, no hierarchy | Borders or background shifts; reserve shadows for floating layers |
| 72px heading with 14px body and nothing between | Broken scale, unbalanced | A coherent scale; size headings to the layout width |
| Emoji / random Lucide icon per bullet | Decoration without meaning | Icons only where they aid scanning or recognition; consistent set and stroke |
| Gradient text on headings | Hard to read, cliché | Weight and color contrast; one accented word at most if it means something |
| Entrance animations on everything | Slows reading, feels gimmicky | Animate state changes and feedback; maybe one restrained entrance |
| Dashboard of 4 KPI cards + 1 area chart + table | Template with text swapped | Lead with what the user must act on; choose charts per question |
| Centered everything | Weak alignment, hard to scan | Left-aligned text with a strong grid; center only short, isolated statements |
| Dark mode with neon accents by default | Trendy, poor legibility | Pick light/dark based on use context; support both via tokens if needed |

None of these are banned. Use one when you can name the purpose it serves in this product.

## 6. Using reference products well

Linear, Stripe, Vercel, Raycast, Notion, and Apple are useful for *qualities*, not looks:
- **Linear** — information density with calm; keyboard-first; subtle borders; restraint with color.
- **Stripe** — documentation-grade clarity; precise typography; data presented with care.
- **Vercel** — monochrome confidence; strong type; generous but purposeful whitespace.
- **Raycast** — crisp command-oriented interaction; tight spacing; meaningful micro-interactions.
- **Notion** — content-first; quiet chrome; approachable defaults.
- **Apple** — imagery and typography do the work; extreme editing of what's shown.

Borrow the principle ("restraint with color", "show the product"), not the pixels.
