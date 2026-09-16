# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Official site of the **Chœur des Pays du Mont-Blanc** (choeurdespaysdumontblanc.fr), repo `Mitchnsun/cpmb`, default branch **`master`** (no `main`). Next.js 16 App Router + React 19 + TypeScript strict + Tailwind CSS 4, fully statically generated from local files — no CMS, no database, no API routes.

Write code, comments, commit messages and docs in **English**. User-facing site copy stays **French** (it serves a French choir). Commits follow Conventional Commits with a scope (`feat(...)`, `fix(...)`, `tech(...)`, `chore(...)`); the redesign epic is #17, tracked in tickets `CPMB-NN`.

## Commands

Node 24 (`.nvmrc`), Yarn 4.18 via `corepack enable`.

| Command                                        | Note                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `yarn dev` / `yarn build` / `yarn start`       | Turbopack by default                                              |
| `yarn lint` / `yarn lint:fix`                  | `next build` no longer lints since Next 16 — lint is its own gate |
| `yarn format` / `yarn format:check`            | Prettier + Tailwind class sort (no CI job runs `format:check`)    |
| `yarn type-check`                              | `tsc --noEmit`                                                    |
| `yarn test` / `yarn test:run` / `yarn test:ci` | watch / single run / CI reporter                                  |
| `yarn test:coverage`                           | coverage report (v8)                                              |
| `yarn test:snapshots`                          | `vitest run -u` — run after any `Footer` change                   |
| `yarn validate` (alias of `validate:concerts`) | `node scripts/validate-concerts.js`                               |

Single test: `yarn vitest run __tests__/components/Header.test.tsx`
By name: `yarn vitest run -t "should render the header"`

Full pre-push gate mirroring CI (`.github/workflows/ci.yml`: lint / test:ci / type-check+build; `data-validation.yml` additionally on `assets/contents/**` and `public/{concerts,articles,carrousel}/**`):

```bash
yarn lint && yarn type-check && yarn test:ci && yarn validate
```

## Architecture

- Routes live in `app/`: `/`, `/presentation` + `/presentation/[artist]`, `/nos-concerts` + `/nos-concerts/[slug]`, `/presse` + `/presse/[slug]`, `/contact`, `/mentions-legales`, `not-found.tsx`. No middleware, no server actions, no `loading.tsx`/`error.tsx`.
- **Content is local files, not a CMS.** `assets/contents/` is the single source: `concerts.json` (array), `articles.json` (array), `artists.json` (**object keyed by slug** — the key _is_ the URL segment), plus typed modules `navigation.ts`, `medias.ts`, `carrousel.ts`. Pages import them directly and prerender.
- **Types are derived from the JSON, never hand-written**: e.g. `import type concerts from "@/assets/contents/concerts.json"` then `type Concert = (typeof concerts)[number]` (relies on `resolveJsonModule`). Widening the JSON widens the type — don't duplicate an interface.
- Every dynamic route pairs `generateStaticParams` + `generateMetadata`; `params` is a **Promise** in Next 16 and must be awaited.
- `components/` is flat PascalCase, one default export per file, no barrel; `components/ui/` holds shadcn (only `drawer.tsx` installed). `utils/` = `cn`, `splitConcertsByDate`/`nextConcertDate`, `formatFrenchDate`/`formatFrenchTime`/`formatFrenchDateTime`/`formatFrenchDateList`, `truncateAtWord`. Icons are local SVGs imported as components via `@svgr/webpack` (turbopack rule in `next.config.ts` + `types/svg.d.ts`) — **not** lucide, despite the dependency.
- `@/*` → repo root, declared in **both** `tsconfig.json` and `vitest.config.ts` — keep them in sync.
- `assets/contents/navigation.ts` is the single nav source feeding the header, the mobile drawer and the footer sitemap; `isNavLinkActive` marks `/presse/<slug>` as active for "Presse". `__tests__/contents/navigation.test.ts` asserts the exact list and order, so a nav change requires a test change.

## Design system

All graphic values live in one `@theme` block in `app/globals.css` (Tailwind v4 — **there is no `tailwind.config.js`**). Never hardcode a colour, size, radius or font in a component; use the generated classes (`bg-bg`, `text-3xl`, `font-display`, `rounded-lg`, `max-w-site`, `menu:`/`max-menu:`, `text-h1` for the one custom title size). Full reference: `docs/CHARTE.md`.

- **Before adding a token to `@theme`, check Tailwind's own scale first** (`node_modules/tailwindcss/theme.css`). If the value already exists, use the native class. If only a detail differs (line-height, most often), override that Tailwind token in `@theme` instead of inventing a new name — it changes no component code and needs no `tailwind-merge` extension. Only declare a new custom token (and document it in `docs/CHARTE.md`) when nothing in Tailwind's scale is close. See "Surcharges de l'échelle Tailwind" and "Règle d'ajout d'un token" in `docs/CHARTE.md`.
- **Always compose classes through `cn()`** (`utils/classnames.ts`). `tailwind-merge` misreads a custom `text-*` size as a text _colour_ and drops it; the `extendTailwindMerge` fix lives only inside `cn`, and today covers only `text-h1` — every other charter size overrides a native Tailwind size instead.
- **The legacy palette is gone (M4).** Every page in `app/` is on charte tokens and `max-w-site mx-auto px-6`; no `sky-*`/`zinc-*`/`gray-*` class and no `container mx-auto` remains outside `Carrousel`. The old `Heading` component was retired with it — write section titles directly (`font-display text-3xl font-semibold`), the heading level says outline, the class says size.
- **Reuse the shared primitives before styling by hand.** `ButtonLink` is the charter CTA (one shape, four tones: `onLight`, `onDark`, `onTeal`, `outline`); `TextLink` is the charter text link (`border-b border-current`, `onLight`/`onDark`, `next/link` for a route and a plain anchor for `mailto:`/external/`#hash`); `Overline` is the mono 12px uppercase label; `PageBanner` is the inner-page header; `InfoPanel` the side-ruled card; `FormField` the labelled form field. All documented in `docs/CHARTE.md`.
- `Carrousel` (+ `assets/contents/carrousel.ts`) is the photo gallery, mounted under the text of `/presentation`. Every slide opens full size in `Lightbox` (Radix Dialog, so focus trap, Escape and focus restore come for free). Only the arrows sit on the photo — a 21/9 frame is 117px tall at 320px, too shallow for a centred arrow and a corner control to both keep a 44px target — so the dots and the pause live under the frame in a row that wraps. The frame is transparent, so whatever the contained photo leaves shows the page background rather than a dark mat, and the arrows carry an opaque pill — they land on the photo or on that light background depending on the photo's shape, and a translucent one washed out over the light. Slides are `object-contain` in a fixed `aspect-[21/9]` frame, never `cover`: most files in `public/carrousel/` were already cropped to a 4.2:1 strip before entering the repo, and covering would crop them again. Adding a photo = drop the file, append `{src, alt, width, height}` — `__tests__/contents/carrousel.test.ts` checks the declared size against the file's own header.
- No media queries by design: `clamp()` carries the mobile→desktop title scale, grids use `grid-cols-[repeat(auto-fit,minmax(300px,1fr))]`.
- `next/font` variables must stay on `<html>`, not `<body>` — `@theme` resolves them at `:root`, and moving them silently kills all typography.
- Animations: the four keyframes declared in `globals.css`, nothing scroll-triggered, a global `prefers-reduced-motion` rule kills them all.
- `assets/contents/medias.ts` is the single entry point for editorial visuals, and every banner now reads from it (`NOT_FOUND_BANNER` included). Its test enforces exactly one `priority` image site-wide — the home hero — and no page hardcodes `priority` any more; keep it that way.

## Content & validation

Adding a concert: append to `assets/contents/concerts.json`, drop the poster in `public/concerts/`, run `yarn validate`. Required fields: `title` / `slug` / `date` (non-empty array of ISO strings) / `location` / `media`; optional: `description` / `programme`. Slug must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and be unique; `media` must resolve to a real file under `public/`. Full rules and error catalogue: `docs/VALIDATION.md`.

`scripts/validate-concerts.js` is dependency-free CommonJS (so CI runs it with no build step) and validates **concerts only** — `articles.json`/`artists.json` only get a JSON-syntax check in the workflow.

## Testing

- `__tests__/` mirrors source (`components/`, `pages/`, `contents/`, `utils/`), files named `<Source>.test.tsx?`.
- Vitest `globals: true` — **do not import** `describe`/`it`/`expect`/`vi`.
- `__tests__/setup.ts` globally mocks `next/image` (→ plain `<img>`, so assert on `img`), `next/navigation` (`notFound()` **throws** `"NEXT_NOT_FOUND"` — page tests catch that; `usePathname()` returns `"/"`, overridable per test), and the `calendar.svg`/`location.svg` icon modules; it also polyfills `setPointerCapture` and `getComputedStyle().transform` because vaul (the drawer) needs them in jsdom.
- Coverage is scoped to `components/**` + `utils/**`, auto-enabled when `CI=true` or `COVERAGE` is set, and CI enforces **lines 90 / statements 90 / branches 90 / functions 75** (`vitest.config.ts`).
- `HeaderMenu` passes `autoFocus` to `<Drawer>` deliberately — without it vaul never arms its focus trap.

## Gotchas

- ESLint flat config in `eslint.config.mjs`. `eslint-config-next/core-web-vitals` already registers `react`, `react-hooks`, `import`, `jsx-a11y`, `@next/next`, `@typescript-eslint` — **re-registering any of them makes ESLint fail** (this previously broke the Vercel build). Local plugins: prettier, unicorn, unused-imports, simple-import-sort, sonarjs, security. Notable rules: `sonarjs/cognitive-complexity: 15`, `react/no-array-index-key: error`, `vitest/no-focused-tests: error`.
- Prettier: double quotes, semicolons, `printWidth: 120`, `trailingComma: "es5"`.
- `app/nos-concerts/page.tsx` calls `Date.now()` at render with an intentional `react-hooks/purity` disable. The page is statically prerendered, so a concert only moves to "passés" on the next deploy (CPMB-11 will address this) — don't "fix" it blindly.
- `ContactForm` has no backend: it validates client-side and opens a `mailto:` link, so its confirmation says the draft is ready, not that a message was sent. Anti-spam is the hidden trap field alone — CPMB-15's render timestamp (reject under 2s) was dropped on purpose: nothing is posted to a server, so there is no endpoint to flood, the fields are React-controlled so a script writing into the DOM fails validation first, and the rule reliably refused a visitor arriving on `?objet=` who let the browser autofill and pasted a message. Server-side validation, real delivery to `bureau@…` and both anti-spam signals are deferred to the follow-up issue. There are no env vars or secrets in this project.
- Vercel deploys need `ENABLE_EXPERIMENTAL_COREPACK=1`, otherwise Yarn 1 silently re-resolves the Yarn 4 lockfile (see README for the log signature to spot this).
- Workflow drift: `ci.yml` triggers on `main`/`master` while `data-validation.yml` triggers on `master`/`develop`; only `master` exists. `data-validation.yml` also path-filters on `utils/validation.ts`, which doesn't exist.
- A fresh `npx shadcn add` emits `@/lib/utils` imports; this repo uses `@/utils/classnames` — fix the import path after generating a component.
