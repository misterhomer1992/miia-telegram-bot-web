# Miia Telegram Bot — Landing Site

**Status:** Design approved 2026-05-22
**Bot:** [@AIEverydayHelper_bot](https://t.me/AIEverydayHelper_bot)
**Design source of truth:** `design/Miia Site.html` (high-fidelity prototype) and `README.md` (visual system + section spec).

## 1. Goal

Recreate the locked-in marketing prototype as a production React codebase that:

- Is **fast** (Lighthouse ≥ 95 across all four categories on desktop and mobile).
- Is **SEO-friendly** (every page is real pre-rendered HTML per locale, with full meta/`hreflang`/canonical/OG/JSON-LD).
- Supports **three locales** (English, Ukrainian, Polish) on **locale-prefixed routes** (`/`, `/uk/`, `/pl/`).
- Supports **dark + light themes** with no flash of wrong theme on first paint.
- Deploys cleanly to **Firebase Hosting** as a pure static site.
- Drives traffic to `https://t.me/AIEverydayHelper_bot`.

Non-goals: blog, dashboard, auth, multi-page IA. This is one landing page rendered three times (one per locale).

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite + React 19 | Fast dev, mature ecosystem |
| Framework | React Router v7 (framework mode) | Built-in SSG via `prerender` — no extra SSR plumbing |
| Rendering | Pure SSG (`ssr: false` + `prerender: ["/", "/uk", "/pl"]`) | Static HTML per locale = best SEO + fits Firebase Hosting |
| Styling | Global tokens stylesheet + CSS Modules | Lifts prototype CSS variables verbatim; per-component scoping; no utility translation tax |
| i18n | `react-i18next` + `i18next` | Type-safe keys, ICU formatting, lazy-load support |
| Analytics | GA4 via `gtag.js` | User preference; async load |
| Hosting | Firebase Hosting | User preference; serves the `build/client/` output as-is |
| Lang | TypeScript (strict) | Type safety on i18n keys, route params |

## 3. Project Structure

```
miia-telegram-bot-web/
├── design/                              # existing prototype (reference, untouched)
│   ├── Miia Site.html
│   └── assets/miia-logo.jpg
├── docs/superpowers/specs/              # this file + future specs
├── public/
│   ├── miia-logo.jpg                    # optimized copy of design asset
│   ├── miia-logo.webp                   # generated webp variant
│   ├── favicon.svg
│   ├── og-image.png                     # 1200×630 social preview
│   ├── robots.txt
│   └── sitemap.xml                      # generated at build time
├── src/
│   ├── root.tsx                         # React Router root, document <html>
│   ├── routes.ts                        # 3 locale-prefixed routes → same landing component
│   ├── routes/landing.tsx               # the single landing route
│   ├── entry.client.tsx                 # hydration entry
│   ├── entry.server.tsx                 # prerender entry
│   ├── sections/                        # one folder per landing section, co-located CSS Module
│   │   ├── Nav/
│   │   ├── Hero/                        # contains PhonePreview/ subcomponent
│   │   ├── WhyMiia/
│   │   ├── Capabilities/                # 7 bento cards, data-driven from i18n
│   │   ├── HowItWorks/
│   │   ├── FinalCTA/
│   │   └── Footer/
│   ├── components/                      # shared atoms: Button, ThemeToggle, LangSwitcher, Pill, Icon
│   ├── hooks/
│   │   ├── useTheme.ts                  # SSG-safe theme hook
│   │   └── useTelegramUrl.ts            # returns the bot URL from a single constant
│   ├── i18n/
│   │   ├── config.ts                    # i18next init + resources
│   │   ├── locales/{en,uk,pl}.json      # dictionaries lifted verbatim from prototype
│   │   └── useT.ts                      # thin typed wrapper around useTranslation
│   ├── lib/
│   │   ├── analytics.ts                 # gtag wrapper: pageview, event
│   │   └── inline-scripts.ts            # theme + lang pre-hydration scripts as string literals
│   ├── styles/
│   │   ├── tokens.css                   # all CSS custom properties (dark default + [data-theme=light])
│   │   ├── reset.css
│   │   ├── fonts.css                    # preconnect + @font-face for the three Google Fonts
│   │   ├── animations.css               # msgIn, typing, pulse, wave, float1/2, etc.
│   │   └── global.css                   # body/html base, .wrap, scrollbar
│   └── types/i18n.d.ts                  # module augmentation for typed translation keys
├── scripts/
│   └── generate-sitemap.ts              # post-build sitemap.xml generator
├── .env.example                         # VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
├── .firebaserc                          # created by `firebase init`
├── firebase.json                        # hosting config
├── index.html                           # Vite entry
├── package.json
├── react-router.config.ts               # ssr:false + prerender:["/", "/uk", "/pl"]
├── tsconfig.json                        # strict
├── vite.config.ts                       # @react-router/dev/vite plugin
├── eslint.config.js
├── .prettierrc
├── .nvmrc                               # pins Node 20 LTS
└── README.md                            # existing handoff doc (kept as-is)
```

### Conventions

- **One section per folder, co-located CSS Module.** Easy to find, easy to delete.
- **Data-driven repeated UI:** Capability cards (×7), Why-Miia cards (×3), How-It-Works steps (×3) read from arrays in the i18n dictionary, not 13 hand-written blocks.
- **No barrel re-exports.** Direct imports keep the build graph tight.
- **`design/` is read-only.** It's the visual source of truth — compare output against it at every milestone.

## 4. Rendering & Routing

**`react-router.config.ts`:**
```ts
import type { Config } from "@react-router/dev/config";
export default {
  ssr: false,
  prerender: ["/", "/uk", "/pl"],
} satisfies Config;
```

**`src/routes.ts`:**
```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  index("./routes/landing.tsx"),
  route("uk", "./routes/landing.tsx", { id: "landing-uk" }),
  route("pl", "./routes/landing.tsx", { id: "landing-pl" }),
] satisfies RouteConfig;
```

`react-router build` emits:
```
build/client/index.html       → en
build/client/uk/index.html    → uk
build/client/pl/index.html    → pl
```

Each HTML contains the fully translated DOM — crawlers see real localized content without running JS.

The landing route derives its locale from its route `id` (or, for `/`, defaults to `en`) and calls `i18n.changeLanguage(locale)` synchronously before rendering.

## 5. Theming Strategy (No FOUC under SSG)

Build-time HTML is emitted with `<html data-theme="dark">` (the prototype's default).

An inline script in `<head>` (kept as a string literal in `src/lib/inline-scripts.ts`, ~15 lines, runs synchronously before paint) resolves the user's theme and applies it:

```js
const stored = localStorage.getItem('miia.theme');
const sysLight = matchMedia('(prefers-color-scheme: light)').matches;
document.documentElement.dataset.theme = stored || (sysLight ? 'light' : 'dark');
```

`useTheme()`:
- On mount, reads `document.documentElement.dataset.theme`.
- On toggle, writes new value to both `dataset.theme` and `localStorage["miia.theme"]`.
- Returns `[theme, toggle]`.

The toggle UI matches the prototype: 38×38 pill, sun + moon SVGs stacked, animated swap (`0.45s cubic-bezier(.5,1.5,.5,1)`).

CSS transitions on `background`/`color`/`border-color` smooth the theme swap site-wide.

## 6. i18n Strategy

### Dictionaries
Lifted verbatim from `design/Miia Site.html`'s `const I18N = { en, uk, pl }` block into `src/i18n/locales/{en,uk,pl}.json`. **Polish and Ukrainian copy is reviewed by the brand owner — do not machine-retranslate.**

Keys are flattened with dots: `hero.title.line1`, `caps.01.title`, `nav.openInTelegram`, etc.

Strings containing inline markup (italic-serif `<em>` spans, gradient-clipped runs) are stored as templates with named placeholder tokens:

```json
{ "hero.title.line1": "Your AI <em1>co-pilot</em1>," }
```

A small `<Trans>` helper component parses these and maps `<em1>`/`<em2>` to the right styled `<em>` spans. Type-safe, XSS-safe (no `dangerouslySetInnerHTML`).

### Routing & locale resolution
- **At prerender:** locale is derived from route ID. `i18n.changeLanguage()` runs before the React tree renders.
- **On client soft-redirect from `/`:** an inline script (sibling to the theme one) runs only when the URL path is exactly `/`. It reads `localStorage["miia.lang"]` first — if present, it redirects to that locale. If not present, it inspects `navigator.language` (`uk-*` → `uk`, `pl-*` → `pl`, else stay on `/`) and writes the result to localStorage so the decision is sticky. Redirects use `location.replace()` so they don't pollute history. **Crawlers don't execute this script**, so bots always see vanilla English `/`. Once a user has visited `/uk` or `/pl` explicitly, `miia.lang` is updated by the lang switcher, so future visits to `/` honor that preference.
- **Lang switcher:** real `<a href="/uk">` elements with React Router's client-side intercept for instant nav. Writes `miia.lang` to localStorage.

### Type-safety
`src/types/i18n.d.ts` declares `resources` in i18next's module augmentation so `t('hero.title.line1')` autocompletes and typos error at build time.

## 7. SEO

Each pre-rendered HTML emits in `<head>`:

- `<html lang="{locale}">`
- `<title>` and `<meta name="description">` — per-locale, from i18n dictionary keys `meta.title` / `meta.description`
- `<link rel="canonical" href="https://{HOST}/{path}">`
- `<link rel="alternate" hreflang="en" href="https://{HOST}/">`
- `<link rel="alternate" hreflang="uk" href="https://{HOST}/uk/">`
- `<link rel="alternate" hreflang="pl" href="https://{HOST}/pl/">`
- `<link rel="alternate" hreflang="x-default" href="https://{HOST}/">`
- Open Graph: `og:title`, `og:description`, `og:image` (1200×630), `og:locale`, `og:type=website`, `og:url`
- Twitter: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- JSON-LD: `Organization` + `WebSite` schema

`{HOST}` is read from `VITE_SITE_URL` env var at build time (defaults to `https://miia.example.com` if unset, replaced before first prod deploy).

### Sitemap & robots
- `public/robots.txt` — allows all, references the sitemap URL.
- `scripts/generate-sitemap.ts` — runs post-build, walks `build/client/**/index.html`, emits `build/client/sitemap.xml` with three `<url>` entries plus `<xhtml:link rel="alternate" hreflang="…">` siblings on each.

### Semantic HTML
- Hero contains the single `<h1>`. Each section has `<h2>`. Cards within sections use `<h3>`.
- `<nav>`, `<main>`, `<section>`, `<footer>` landmarks.
- All decorative SVGs get `aria-hidden="true"`.
- CTAs that navigate are `<a>`, controls that toggle UI state are `<button>`.
- Theme toggle has `aria-label="Toggle theme"`; lang button has `aria-haspopup="true"` + dynamic `aria-expanded`.

## 8. Performance

**Targets:** Lighthouse ≥ 95 (Performance / Accessibility / Best Practices / SEO) on both desktop and mobile.

**Critical-path optimizations:**

- **Fonts:** `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` and `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the two most-used Space Grotesk weights (400, 500). `font-display: swap` everywhere. Instrument Serif and JetBrains Mono load normally.
- **Logo image:** The source JPEG is 2.3 MB. Build-time processing (via `vite-imagetools` or a small build script) emits `miia-logo.webp` (~30 KB at 144×144 @2x) plus a JPEG fallback. Use `<picture>` with `loading="eager"` for the nav logo. The phone-preview `img-stub` is a CSS gradient — no image bytes.
- **Icons:** All inline SVG per prototype. Zero icon-library bytes.
- **CSS:** Global tokens + animations + per-component CSS Modules. Vite handles critical-CSS extraction. No CSS-in-JS runtime cost.
- **JS bundle:** React + React Router + react-i18next + app shell. Target initial bundle < 80 KB gzipped. No code-splitting needed for a single page.
- **Prefetch:** React Router `prefetch="intent"` on lang-switcher links — hovering preloads the other locale's HTML + data.
- **Caching headers (`firebase.json`):**
  - `**/*.@(js|css|woff2|webp|avif|jpg|png|svg)` → `Cache-Control: public, max-age=31536000, immutable`
  - `**/*.html` → `Cache-Control: public, max-age=0, must-revalidate`
- **GA4 loaded async**, after first paint. No blocking.

## 9. Analytics (GA4)

- `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in `.env` (committed `.env.example` with placeholder).
- `src/lib/analytics.ts` exposes:
  - `initAnalytics()` — injects the gtag script + configures with `send_page_view: false`.
  - `pageview(path: string, locale: string)` — fires manual pageview per route change.
  - `event(name: 'open_telegram' | 'theme_toggle' | 'lang_switch', params?)` — typed event surface.
- Initialized once in `entry.client.tsx`.
- A `useLocation()` effect in `landing.tsx` fires `pageview` on mount + lang change.
- CTA clicks (`open_telegram`), theme toggle (`theme_toggle`), lang switch (`lang_switch`) wired in the relevant components.

## 10. Firebase Hosting

### `firebase.json`
```jsonc
{
  "hosting": {
    "public": "build/client",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      { "source": "**/*.@(js|css|woff2|webp|avif|jpg|png|svg)",
        "headers": [{ "key": "Cache-Control", "value": "public,max-age=31536000,immutable" }] },
      { "source": "**/*.html",
        "headers": [{ "key": "Cache-Control", "value": "public,max-age=0,must-revalidate" }] }
    ],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

The catch-all rewrite to `/index.html` is a safety net for any unknown path. A proper 404 page can be wired later.

### `.firebaserc`
Created interactively by `firebase init hosting` (asks for project ID). Not committed initially — added once the user runs `firebase init`.

### Scripts (`package.json`)
```
"dev":             "react-router dev"
"build":           "react-router build && node scripts/generate-sitemap.ts"
"preview":         "vite preview"
"typecheck":       "tsc --noEmit"
"lint":            "eslint ."
"format":          "prettier --write ."
"deploy":          "npm run build && firebase deploy --only hosting"
"deploy:preview":  "npm run build && firebase hosting:channel:deploy preview"
```

## 11. Constants

- **Telegram bot URL:** `https://t.me/AIEverydayHelper_bot` — single source in `src/hooks/useTelegramUrl.ts` (also referenced in build-time meta tag generation if needed).
- **Footer link destinations:** `#` placeholders with `TODO` comments — to be wired before first prod deploy.
- **Site host:** `VITE_SITE_URL` env var, used for canonical/hreflang/OG URLs at build time.

## 12. Verification Plan

Run at each milestone (don't claim done without):

1. **`npm run typecheck && npm run lint && npm run build`** — clean.
2. **Static-output check:** `ls build/client/{index.html,uk/index.html,pl/index.html}` exist. `grep` Polish/Ukrainian strings in the respective HTML files (real prerendered text, not JS-shell).
3. **`npm run preview`** + open in browser:
   - Switch theme — no FOUC, smooth transition, persists on reload.
   - Switch language — all visible copy updates, URL changes to `/uk/` or `/pl/`, persists on reload.
   - Chat-preview animation plays (messages fade in staggered, typing dots bounce).
   - Capability bento grid renders at the right column spans across breakpoints (6→4→2).
   - CTAs deep-link to `https://t.me/AIEverydayHelper_bot`.
4. **Visual diff vs `design/Miia Site.html`** — open both side-by-side. If anything drifts (spacing, color, type), screenshot both and reconcile against the README design tokens. Don't improvise values.
5. **Lighthouse** — desktop + mobile, all four scores ≥ 95.
6. **`view-source:` on each built HTML** — confirm meta tags, hreflang cluster, canonical, OG, JSON-LD all present and locale-correct.

## 13. Out of Scope (for this spec)

- Backend / API.
- A custom 404 page (catch-all rewrite is sufficient for v1).
- E2E tests (Playwright) — could be added in a follow-up plan.
- A11y audit beyond the baseline semantic HTML + aria attributes already covered.
- CMS-driven content.
- Real footer link destinations (placeholders for now).
