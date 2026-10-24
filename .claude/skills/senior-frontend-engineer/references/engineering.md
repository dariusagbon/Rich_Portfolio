# Engineering Standards

Patterns for React / Next.js / TypeScript / Tailwind. Follow the project's conventions where they differ.

## Contents
1. Component architecture
2. Styling with Tailwind
3. Accessibility details
4. Forms
5. Data, loading, empty, and error states
6. Next.js specifics
7. Performance
8. Things to avoid

---

## 1. Component architecture

- Small, focused components with typed props. Extract a component when it's reused or when it has its own state/behavior — not preemptively.
- Composition over configuration: prefer `children` and slots over 15 boolean props.
- Variants: use the project's existing approach (`cva`, `tailwind-variants`, or a simple `variant` map). Example:

```tsx
const variants = {
  primary: "bg-accent text-accent-fg hover:bg-accent/90",
  secondary: "border border-border bg-bg hover:bg-surface",
  ghost: "hover:bg-surface",
  danger: "bg-danger text-white hover:bg-danger/90",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  loading?: boolean;
};

export function Button({ variant = "primary", loading, disabled, children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md px-3.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner className="size-4" aria-hidden />}
      {children}
    </button>
  );
}
```

- Keep state as local as possible; lift only when shared. Derive values instead of syncing state with effects.
- Colocate types with components; share domain types (`Customer`, `Invoice`) from one module.
- If shadcn/ui, Radix, Headless UI, or React Aria is installed, use its primitives for Dialog, Popover, DropdownMenu, Tabs, Select, Tooltip, Combobox — they solve focus management and ARIA correctly. Restyle them to the direction rather than accepting defaults verbatim.

## 2. Styling with Tailwind

- Map design tokens into the Tailwind theme so classes read as roles (`bg-surface`, `text-muted`), not raw palette (`bg-gray-50`) — unless the project already uses raw palette classes consistently.
- Avoid arbitrary values (`mt-[13px]`, `text-[#3b3b3b]`) except for genuine one-offs like a specific aspect ratio or grid template.
- Use `cn()`/`clsx` + `tailwind-merge` for conditional classes when the project has them.
- Mobile-first: base classes for small screens, `sm:`/`md:`/`lg:` to enhance.
- Layout helpers that prevent common bugs: `min-w-0` on flex children with text, `truncate`, `line-clamp-2`, `shrink-0` on icons/avatars, `overflow-x-auto` for wide content, `scroll-mt-*` for anchored sections under sticky headers.
- Use `size-*`, `gap-*`, `space-y-*` consistently; prefer `gap` in flex/grid.

## 3. Accessibility details

- Landmarks: one `main`, `header`, `nav` (with `aria-label` if multiple), `footer`. Logical heading order (one `h1`).
- Buttons vs links: navigation → `<a href>`/`<Link>`; actions → `<button type="button">`. Never `div onClick`.
- Icon-only controls: `aria-label`; decorative icons `aria-hidden="true"`.
- Focus: visible `focus-visible` styles on every interactive element; logical tab order; return focus to the trigger when dialogs/menus close; skip link for long nav.
- Dialogs: `role="dialog"`, `aria-modal`, labelled by title, focus trap, Escape to close, scroll lock.
- Live updates: toasts and async results in an `aria-live="polite"` region.
- Forms: `<label htmlFor>`, `aria-invalid` + `aria-describedby` for errors, group related inputs with `fieldset`/`legend`.
- Don't encode meaning in color alone; pair with text/icon.
- Respect `prefers-reduced-motion` and `prefers-color-scheme` when relevant.
- Test: tab through the whole page; check focus is always visible and nothing is unreachable.

## 4. Forms

- Use the project's form library (React Hook Form, Formik, Conform, server actions) and schema validation (Zod, Valibot, Yup) if installed.
- Validate on submit, then on change/blur for touched fields; don't yell errors before the user has typed.
- Errors: specific and actionable ("Enter an email like name@company.com"), placed under the field, plus a summary or focus on the first invalid field on submit.
- Submission: disable submit + show loading, prevent double submit, show success feedback, preserve input on server error.
- Inputs: correct `type`, `autocomplete`, `inputmode`, `name`; sensible `maxLength`; placeholders are examples, not labels.

## 5. Data, loading, empty, and error states

For every async view, handle: loading → success (with data) → success (empty) → error. Example shape:

```tsx
if (isLoading) return <TableSkeleton rows={8} />;
if (error) return <ErrorState message="Couldn't load invoices." onRetry={refetch} />;
if (!data.length) return <EmptyState title="No invoices yet" action={<Button>Create invoice</Button>} />;
return <InvoiceTable invoices={data} />;
```

- Skeletons should match the final layout dimensions to avoid layout shift.
- Use the project's data layer (React Query/SWR/server components/loaders). Don't hardcode mock arrays into components when an API exists. When mocking is necessary, put typed fixtures in one file (e.g. `lib/mock-data.ts`) behind the same function signature the real fetcher will have.
- Optimistic updates for quick, reversible actions; confirmations for destructive ones (or undo).

## 6. Next.js specifics

- App Router: default to Server Components; add `"use client"` only to components needing state, effects, or browser APIs — keep client islands small.
- `next/image` with `width`/`height` or `fill` + `sizes`; `priority` for the LCP image only.
- `next/font` for fonts (self-hosted, no layout shift).
- `next/link` for internal navigation.
- Metadata via `export const metadata` / `generateMetadata`.
- Loading/error UI via `loading.tsx` / `error.tsx` where appropriate.

## 7. Performance

- Avoid layout shift: reserve image/media space, use font `display: swap` via `next/font` or `font-display`.
- Lazy-load below-the-fold images and heavy components (charts, editors) with dynamic import.
- Don't ship big libraries for small needs (moment, lodash full, a full animation lib for one fade).
- Virtualize very long lists (>~200 rows).
- Memoize only when profiling or obvious hot paths justify it.

## 8. Things to avoid

- Rewriting working code that's outside the task's scope.
- Introducing a second styling system or component library alongside an existing one.
- New dependencies for things the platform or existing deps already do.
- Non-functional decorative controls (fake search, tabs that don't switch, dead links `href="#"`).
- `outline: none` without a replacement focus style.
- Fixed heights on text containers; fixed widths that break on mobile.
- `!important` and z-index escalation wars — fix stacking contexts instead.
- Inline styles for things tokens/classes cover.
