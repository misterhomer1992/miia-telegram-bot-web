# Miia Telegram Bot Landing Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Miia landing site per `docs/superpowers/specs/2026-05-22-miia-site-design.md` — a React Router v7 SSG site with 3 locales (en/uk/pl), dark + light themes, deployed to Firebase Hosting.

**Architecture:** Vite + React 19 + React Router v7 in framework mode with `ssr: false` + `prerender: ["/", "/uk", "/pl"]`. Output is static HTML per locale. Styling via global CSS custom properties (lifted from `design/Miia Site.html`) + per-component CSS Modules. i18n via `react-i18next` with locale-prefixed routes. Analytics via GA4 (`gtag.js`). Hosting on Firebase.

**Tech Stack:** Node 20, Vite 6, React 19, React Router 7, TypeScript (strict), `react-i18next`, Vitest + `@testing-library/react` + `happy-dom`, ESLint 9, Prettier 3, Firebase CLI.

---

## Conventions

- **Commit after every task** using Conventional Commits (`feat:`, `chore:`, `style:`, `test:`, `fix:`, `docs:`). The commit step in each task lists the exact command.
- **Before each commit:** run `npm run typecheck && npm run lint && npm test -- --run` (after Vitest is installed). If anything fails, fix before committing.
- **Visual fidelity rule:** when porting markup from `design/Miia Site.html`, lift values **verbatim** — colors, sizes, spacing, animation timing. If you must improvise, leave a `/* TODO(fidelity): … */` comment and flag it.
- **No `dangerouslySetInnerHTML`.** Strings with markup use the `<Trans>` helper introduced in Task 11.
- **CSS Modules:** filenames are `Component.module.css`, classnames are camelCase, referenced as `styles.className`.
- **Working directory:** all paths are relative to `/Users/marius/Documents/projects/miia-telegram-bot-web/`.

---

## Phase 1 — Scaffold

### Task 1: Initialize package.json, Node pin, EditorConfig

**Files:**
- Create: `package.json`
- Create: `.nvmrc`
- Create: `.editorconfig`

- [ ] **Step 1: Create `.nvmrc`**

```
20
```

- [ ] **Step 2: Create `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "miia-telegram-bot-web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build && node --experimental-strip-types scripts/generate-sitemap.ts",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest",
    "deploy": "npm run build && firebase deploy --only hosting",
    "deploy:preview": "npm run build && firebase hosting:channel:deploy preview"
  }
}
```

Note: the `build` script's sitemap step is added in Task 26 — for now `node --experimental-strip-types scripts/generate-sitemap.ts` will fail until that file exists. That's fine; we only run `npm run build` after Task 26.

- [ ] **Step 4: Install runtime dependencies**

```bash
npm install react@^19 react-dom@^19 react-router@^7 @react-router/dev@^7 @react-router/node@^7 isbot@^5 i18next@^24 react-i18next@^15
```

- [ ] **Step 5: Install dev dependencies**

```bash
npm install -D typescript@^5.6 @types/react@^19 @types/react-dom@^19 @types/node@^20 vite@^6 vite-tsconfig-paths@^5 vite-imagetools@^7 eslint@^9 @eslint/js@^9 typescript-eslint@^8 eslint-plugin-react@^7 eslint-plugin-react-hooks@^5 prettier@^3 vitest@^2 @vitest/coverage-v8@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14 happy-dom@^15 firebase-tools@^13
```

- [ ] **Step 6: Verify install**

Run: `npm ls --depth=0`

Expected: no `UNMET DEPENDENCY` errors.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .nvmrc .editorconfig
git commit -m "chore: scaffold package.json and toolchain"
```

---

### Task 2: TypeScript, Vite, React Router config

**Files:**
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `react-router.config.ts`
- Create: `index.html`

- [ ] **Step 1: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vite/client", "@react-router/node", "vitest/globals", "@testing-library/jest-dom"],
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "scripts/**/*", "vite.config.ts", "react-router.config.ts", "*.d.ts"]
}
```

- [ ] **Step 2: Create `react-router.config.ts`**

```ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ["/", "/uk", "/pl"],
  appDirectory: "src",
} satisfies Config;
```

- [ ] **Step 3: Create `vite.config.ts`**

```ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), imagetools()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 4: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Note: this Vite entry isn't used in framework mode (root.tsx generates the document) but Vite expects it to exist.

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json vite.config.ts react-router.config.ts index.html
git commit -m "chore: configure typescript, vite, and react router"
```

---

### Task 3: ESLint + Prettier

**Files:**
- Create: `eslint.config.js`
- Create: `.prettierrc`
- Create: `.prettierignore`

- [ ] **Step 1: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

- [ ] **Step 2: Create `.prettierignore`**

```
node_modules/
build/
dist/
.react-router/
package-lock.json
design/
```

- [ ] **Step 3: Create `eslint.config.js`**

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  { ignores: ["build/**", "dist/**", ".react-router/**", "node_modules/**", "design/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
```

- [ ] **Step 4: Verify lint runs (will pass with no source files yet)**

Run: `npm run lint`

Expected: exit 0, no output.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.js .prettierrc .prettierignore
git commit -m "chore: add eslint and prettier"
```

---

### Task 4: Vitest setup file

**Files:**
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 2: Smoke-test Vitest with a trivial test**

Create `src/test/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("toolchain smoke", () => {
  it("can run a passing test", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npm test -- --run`

Expected: 1 passed, 0 failed.

- [ ] **Step 4: Commit**

```bash
git add src/test/
git commit -m "chore: configure vitest with happy-dom and testing-library"
```

---

### Task 5: Minimal app shell — root, entry, routes, empty landing

**Files:**
- Create: `src/root.tsx`
- Create: `src/entry.client.tsx`
- Create: `src/entry.server.tsx`
- Create: `src/routes.ts`
- Create: `src/routes/landing.tsx`

- [ ] **Step 1: Create `src/routes.ts`**

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("uk", "routes/landing.tsx", { id: "landing-uk" }),
  route("pl", "routes/landing.tsx", { id: "landing-pl" }),
] satisfies RouteConfig;
```

- [ ] **Step 2: Create `src/root.tsx`**

```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export default function Root() {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create `src/entry.client.tsx`**

```tsx
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
```

- [ ] **Step 4: Create `src/entry.server.tsx`**

```tsx
import { PassThrough } from "node:stream";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const readyOption = userAgent && isbot(userAgent) ? "onAllReady" : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, { headers: responseHeaders, status: responseStatusCode }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) console.error(error);
        },
      },
    );
    setTimeout(abort, 5_000);
  });
}
```

- [ ] **Step 5: Create `src/routes/landing.tsx`**

```tsx
export default function Landing() {
  return (
    <main>
      <h1>Miia</h1>
      <p>Coming soon.</p>
    </main>
  );
}
```

- [ ] **Step 6: Verify dev server starts**

Run: `npm run dev`

Expected: server listens at `http://localhost:5173` (or similar). Open in browser — see "Miia / Coming soon."

Stop the server with Ctrl+C.

- [ ] **Step 7: Verify typecheck**

Run: `npm run typecheck`

Expected: exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/root.tsx src/entry.client.tsx src/entry.server.tsx src/routes.ts src/routes/landing.tsx
git commit -m "feat: minimal react router v7 app shell"
```

---

## Phase 2 — Design tokens & global styles

### Task 6: Lift CSS custom properties into tokens.css

**Files:**
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Open prototype for reference**

Open `design/Miia Site.html` in your editor. Locate the `<style>` block — find the `:root` selector and the `[data-theme="light"]` selector. These define every CSS custom property used by the design.

- [ ] **Step 2: Create `src/styles/tokens.css`**

Paste the `:root { … }` block and the `[data-theme="light"] { … }` block verbatim into `src/styles/tokens.css`. Do not paraphrase token names or values. The file should look like:

```css
:root {
  /* dark theme defaults */
  --ink: #050b1a;
  --bg: #0a1428;
  --bg-2: #0d1a35;
  --panel: #122444;
  --panel-2: #16294f;
  --line: #1f3868;
  --line-2: #284680;
  --text: #e8eef7;
  --text-2: #a9b8d4;
  --text-3: #6f82a8;
  --blue: #6bb6f0;
  --blue-2: #4a96d8;
  --blue-soft: rgba(107, 182, 240, 0.14);
  --amber: #f5a166;
  --amber-2: #e88a4a;
  --amber-soft: rgba(245, 161, 102, 0.14);
  /* + every other custom property from the prototype: --nav-bg, --grid-color, --card-grad-from, --shadow-strong, --shadow-med, etc. */
}

[data-theme="light"] {
  --bg: #f5f7fc;
  --bg-2: #ffffff;
  --panel: #ffffff;
  --panel-2: #f8fafd;
  --line: #e2e8f3;
  --line-2: #c4d0e4;
  --text: #0a1428;
  --text-2: #4a5a78;
  --text-3: #8896b3;
  --blue: #2876c4;
  --blue-2: #1c5ea3;
  --amber: #d97843;
  --amber-2: #b6562a;
  /* + every other token overridden in the prototype's light theme */
}
```

After saving, grep `design/Miia Site.html` for `--` to make sure you haven't missed any tokens. Each token defined in the prototype must appear in tokens.css.

- [ ] **Step 3: Verify by diffing token names**

Run:
```bash
grep -oE '\-\-[a-z0-9-]+' design/Miia\ Site.html | sort -u > /tmp/proto-tokens.txt
grep -oE '\-\-[a-z0-9-]+' src/styles/tokens.css | sort -u > /tmp/ours-tokens.txt
diff /tmp/proto-tokens.txt /tmp/ours-tokens.txt
```

Expected: no missing tokens (some prototype-internal aliases may show as extras in proto — that's OK; missing tokens in ours-tokens.txt is a fail).

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(styles): lift design tokens from prototype"
```

---

### Task 7: Fonts, reset, global, animations CSS

**Files:**
- Create: `src/styles/fonts.css`
- Create: `src/styles/reset.css`
- Create: `src/styles/global.css`
- Create: `src/styles/animations.css`

- [ ] **Step 1: Create `src/styles/fonts.css`**

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&display=swap");

:root {
  --font-display: "Space Grotesk", system-ui, -apple-system, sans-serif;
  --font-serif: "Instrument Serif", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
}
```

(Preconnect + preload `<link>` tags will be added in `root.tsx` in Task 25.)

- [ ] **Step 2: Create `src/styles/reset.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html,
body {
  height: 100%;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 3: Create `src/styles/global.css`**

Lift global rules from the prototype — body background/text color, `.wrap` container (max-width 1240px, 0 32px padding), scrollbar styling. Reference `design/Miia Site.html` `<style>` block, search for `body {`, `.wrap {`, `::-webkit-scrollbar`. Copy those rules into `global.css` verbatim, replacing any literal colors with the corresponding `var(--token)` references (which they already are in the prototype).

```css
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-display);
  font-size: 17px;
  line-height: 1.55;
  transition: background 0.25s ease, color 0.25s ease;
}

.wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
}

/* + scrollbar rules and any other global selectors from the prototype */
```

- [ ] **Step 4: Create `src/styles/animations.css`**

Lift every `@keyframes` block from the prototype verbatim. Reference: search `design/Miia Site.html` for `@keyframes`. The set includes (at minimum): `msgIn`, `typing`, `pulse`, `wave`, `float1`, `float2`, `blink`. Copy each block as-is.

```css
@keyframes pulse {
  /* lifted from prototype */
}

@keyframes msgIn {
  /* lifted from prototype */
}

/* … etc. */
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/fonts.css src/styles/reset.css src/styles/global.css src/styles/animations.css
git commit -m "feat(styles): add fonts, reset, global, and animations"
```

---

### Task 8: Wire styles into root.tsx via Links export

**Files:**
- Modify: `src/root.tsx`

- [ ] **Step 1: Update `src/root.tsx` to import styles via Links export**

```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";

import resetHref from "./styles/reset.css?url";
import tokensHref from "./styles/tokens.css?url";
import fontsHref from "./styles/fonts.css?url";
import animationsHref from "./styles/animations.css?url";
import globalHref from "./styles/global.css?url";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: resetHref },
  { rel: "stylesheet", href: tokensHref },
  { rel: "stylesheet", href: fontsHref },
  { rel: "stylesheet", href: animationsHref },
  { rel: "stylesheet", href: globalHref },
];

export default function Root() {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev server still works and styles apply**

Run: `npm run dev`

Open browser, confirm: page has dark navy background, "Miia" appears in Space Grotesk font. Stop server (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add src/root.tsx
git commit -m "feat(root): wire global styles and font preconnect"
```

---

## Phase 3 — i18n foundation

### Task 9: Lift translation dictionaries

**Files:**
- Create: `src/i18n/locales/en.json`
- Create: `src/i18n/locales/uk.json`
- Create: `src/i18n/locales/pl.json`

- [ ] **Step 1: Locate the I18N object in the prototype**

Open `design/Miia Site.html`, scroll to the `<script>` block at the bottom. Find `const I18N = { en: {...}, uk: {...}, pl: {...} };`.

- [ ] **Step 2: Decide on key structure**

Use dot-flattened keys. Group by section: `meta.title`, `nav.links.capabilities`, `hero.eyebrow`, `hero.title.line1`, `hero.title.line2`, `hero.lede`, `hero.cta.primary`, `hero.cta.ghost`, `hero.meta`, `why.0.numeral`, `why.0.title`, `why.0.body`, `caps.0.num`, `caps.0.title`, `caps.0.body`, `how.0.label`, `how.0.title`, `how.0.body`, `cta.title`, `cta.lede`, `cta.button`, `footer.columns.0.title`, `footer.columns.0.links.0.label`, `footer.bottom`, `lang.en`, `lang.uk`, `lang.pl`, etc.

For inline italic-serif emphasis (the `<em>` spans), use token placeholders like `<em1>…</em1>` inside the string. The `<Trans>` helper (Task 11) interprets these.

- [ ] **Step 3: Translate prototype's keys to dot-flattened JSON for English**

Create `src/i18n/locales/en.json`:

```json
{
  "meta": {
    "title": "Miia — your AI co-pilot in Telegram",
    "description": "Miia bundles GPT, Gemini, and Grok into one Telegram chat. Free to start. No sign-up. ~60 seconds to set up."
  },
  "nav": {
    "brand": "Miia",
    "brandSub": "AI for Telegram",
    "links": {
      "capabilities": "Capabilities",
      "how": "How it works",
      "support": "Support"
    },
    "openInTelegram": "Open in Telegram"
  },
  "hero": {
    "eyebrow": "LIVE · TELEGRAM BOT",
    "title": {
      "line1": "Your AI <em1>co-pilot</em1>,",
      "line2": "inside the chat <em2>you already use</em2>."
    },
    "lede": "…",
    "cta": { "primary": "Open Miia in Telegram", "ghost": "See what it does" },
    "meta": "FREE TO START · NO SIGN-UP · ~60s SETUP"
  },
  "why": [
    { "numeral": "i.", "title": "…", "body": "…" },
    { "numeral": "ii.", "title": "…", "body": "…" },
    { "numeral": "iii.", "title": "…", "body": "…" }
  ],
  "caps": [
    { "num": "01 / chat", "title": "Smart conversations", "body": "…" },
    { "num": "02 / image", "title": "Image generation", "body": "…" },
    { "num": "03 / voice", "title": "Voice", "body": "…" },
    { "num": "04 / docs", "title": "Documents", "body": "…" },
    { "num": "05 / vision", "title": "Vision", "body": "…" },
    { "num": "06 / links", "title": "Links & video", "body": "…" },
    { "num": "07 / threads", "title": "Threads", "body": "…" }
  ],
  "how": [
    { "label": "STEP 01", "title": "…", "body": "…" },
    { "label": "STEP 02", "title": "…", "body": "…" },
    { "label": "STEP 03", "title": "…", "body": "…" }
  ],
  "cta": { "title": "…", "lede": "…", "button": "Open Miia in Telegram" },
  "footer": {
    "columns": [
      { "title": "Support", "links": [ { "label": "Help center", "href": "#" }, { "label": "Contact us", "href": "#" } ] },
      { "title": "Community", "links": [ { "label": "Telegram channel", "href": "#" }, { "label": "Discussion group", "href": "#" } ] },
      { "title": "Legal", "links": [ { "label": "Privacy", "href": "#" }, { "label": "Terms", "href": "#" }, { "label": "Data & security", "href": "#" } ] }
    ],
    "bottom": "BUILT FOR TELEGRAM · NOT AFFILIATED"
  },
  "lang": { "en": "English", "uk": "Ukrainian", "pl": "Polish" }
}
```

For each `"…"` placeholder above, **copy the exact English text from the prototype's `I18N.en` object** — no paraphrasing. Convert inline `<em>` spans in headings to `<em1>…</em1>` / `<em2>…</em2>` numbered tokens.

- [ ] **Step 4: Repeat for Ukrainian and Polish**

Create `src/i18n/locales/uk.json` and `src/i18n/locales/pl.json` with identical key structure, populated from the prototype's `I18N.uk` and `I18N.pl` objects. **Do not machine-retranslate** — the prototype copy has been reviewed by the brand owner.

- [ ] **Step 5: Verify all three files have identical key sets**

Run (requires `jq`):
```bash
diff <(jq -r 'paths | join(".")' src/i18n/locales/en.json | sort) \
     <(jq -r 'paths | join(".")' src/i18n/locales/uk.json | sort)
diff <(jq -r 'paths | join(".")' src/i18n/locales/en.json | sort) \
     <(jq -r 'paths | join(".")' src/i18n/locales/pl.json | sort)
```

Expected: both diffs are empty.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/locales/
git commit -m "feat(i18n): lift translation dictionaries from prototype"
```

---

### Task 10: i18next config + typed keys

**Files:**
- Create: `src/i18n/config.ts`
- Create: `src/types/i18n.d.ts`

- [ ] **Step 1: Create `src/i18n/config.ts`**

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import uk from "./locales/uk.json";
import pl from "./locales/pl.json";

export const supportedLanguages = ["en", "uk", "pl"] as const;
export type Locale = (typeof supportedLanguages)[number];

export const defaultLocale: Locale = "en";

export const resources = {
  en: { translation: en },
  uk: { translation: uk },
  pl: { translation: pl },
} as const;

let initialized = false;
export function setupI18n(locale: Locale = defaultLocale) {
  if (!initialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: defaultLocale,
      interpolation: { escapeValue: false },
      returnNull: false,
    });
    initialized = true;
  } else if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return i18n;
}

export default i18n;
```

- [ ] **Step 2: Create `src/types/i18n.d.ts` for typed keys**

```ts
import "i18next";
import en from "../i18n/locales/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
    returnNull: false;
  }
}
```

- [ ] **Step 3: Verify typecheck passes**

Run: `npm run typecheck`

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/config.ts src/types/i18n.d.ts
git commit -m "feat(i18n): configure i18next with typed resources"
```

---

### Task 11: `<Trans>` helper for inline markup

**Files:**
- Create: `src/i18n/Trans.tsx`
- Create: `src/i18n/Trans.test.tsx`
- Create: `src/i18n/Trans.module.css`

- [ ] **Step 1: Write the failing test**

Create `src/i18n/Trans.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Trans } from "./Trans";

describe("Trans", () => {
  it("renders plain text unchanged", () => {
    render(<Trans>{"Hello world"}</Trans>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders <em1> tokens as a blue-gradient emphasis span", () => {
    render(<Trans>{"Your AI <em1>co-pilot</em1>, ready."}</Trans>);
    const em = screen.getByText("co-pilot");
    expect(em.tagName).toBe("EM");
    expect(em).toHaveAttribute("data-variant", "blue");
  });

  it("renders <em2> tokens as an amber-gradient emphasis span", () => {
    render(<Trans>{"inside the chat <em2>you already use</em2>."}</Trans>);
    const em = screen.getByText("you already use");
    expect(em.tagName).toBe("EM");
    expect(em).toHaveAttribute("data-variant", "amber");
  });

  it("renders multiple tokens in order", () => {
    render(<Trans>{"a <em1>b</em1> c <em2>d</em2> e"}</Trans>);
    expect(screen.getByText("b")).toHaveAttribute("data-variant", "blue");
    expect(screen.getByText("d")).toHaveAttribute("data-variant", "amber");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/i18n/Trans.test.tsx`

Expected: fail with "Cannot find module './Trans'".

- [ ] **Step 3: Create `src/i18n/Trans.module.css`**

```css
.em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
}

.em[data-variant="blue"] {
  background: linear-gradient(135deg, var(--blue), var(--blue-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.em[data-variant="amber"] {
  background: linear-gradient(135deg, var(--amber), var(--amber-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

- [ ] **Step 4: Create `src/i18n/Trans.tsx`**

```tsx
import { Fragment, type ReactNode } from "react";
import styles from "./Trans.module.css";

const TOKEN_RE = /<(em[12])>([^<]*)<\/\1>/g;
const VARIANT: Record<string, "blue" | "amber"> = {
  em1: "blue",
  em2: "amber",
};

export function Trans({ children }: { children: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = TOKEN_RE.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }
    const [, tagName, inner] = match;
    parts.push(
      <em key={key++} className={styles.em} data-variant={VARIANT[tagName!]}>
        {inner}
      </em>,
    );
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }
  TOKEN_RE.lastIndex = 0;

  return <Fragment>{parts}</Fragment>;
}
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npm test -- --run src/i18n/Trans.test.tsx`

Expected: 4 passed.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/Trans.tsx src/i18n/Trans.test.tsx src/i18n/Trans.module.css
git commit -m "feat(i18n): add Trans helper for typed inline markup"
```

---

### Task 12: useT typed wrapper hook

**Files:**
- Create: `src/i18n/useT.ts`

- [ ] **Step 1: Create `src/i18n/useT.ts`**

```ts
import { useTranslation } from "react-i18next";

export function useT() {
  const { t, i18n } = useTranslation();
  return { t, locale: i18n.language };
}
```

The thin wrapper exists so callers don't need to know about `useTranslation`'s shape, and so we can swap underlying library later without touching call sites.

- [ ] **Step 2: Commit**

```bash
git add src/i18n/useT.ts
git commit -m "feat(i18n): add useT wrapper hook"
```

---

## Phase 4 — Theme & Lang infrastructure

### Task 13: Pre-hydration inline scripts (theme + lang)

**Files:**
- Create: `src/lib/inline-scripts.ts`
- Create: `src/lib/inline-scripts.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/inline-scripts.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { themeScript, langRedirectScript } from "./inline-scripts";

describe("themeScript", () => {
  it("is a non-empty string", () => {
    expect(typeof themeScript).toBe("string");
    expect(themeScript.length).toBeGreaterThan(0);
  });

  it("contains the dataset assignment", () => {
    expect(themeScript).toContain("documentElement.dataset.theme");
  });

  it("references the storage key 'miia.theme'", () => {
    expect(themeScript).toContain("miia.theme");
  });
});

describe("langRedirectScript", () => {
  it("is a non-empty string", () => {
    expect(typeof langRedirectScript).toBe("string");
    expect(langRedirectScript.length).toBeGreaterThan(0);
  });

  it("only redirects from the root path", () => {
    expect(langRedirectScript).toContain('location.pathname===\"/\"');
  });

  it("uses location.replace to avoid polluting history", () => {
    expect(langRedirectScript).toContain("location.replace");
  });

  it("references the storage key 'miia.lang'", () => {
    expect(langRedirectScript).toContain("miia.lang");
  });
});
```

- [ ] **Step 2: Run test, verify failure**

Run: `npm test -- --run src/lib/inline-scripts.test.ts`

Expected: fail with module not found.

- [ ] **Step 3: Create `src/lib/inline-scripts.ts`**

```ts
export const themeScript = `(function(){try{var s=localStorage.getItem('miia.theme');var l=window.matchMedia('(prefers-color-scheme: light)').matches;document.documentElement.dataset.theme=s||(l?'light':'dark');}catch(_){}})();`;

export const langRedirectScript = `(function(){try{if(location.pathname===\"/\"){var s=localStorage.getItem('miia.lang');var c=s||(/^uk/i.test(navigator.language||'')?'uk':/^pl/i.test(navigator.language||'')?'pl':'en');if(!s)localStorage.setItem('miia.lang',c);if(c!=='en')location.replace('/'+c);}}catch(_){}})();`;
```

These are runtime strings injected into the document head. They run synchronously before React hydrates.

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test -- --run src/lib/inline-scripts.test.ts`

Expected: 7 passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/inline-scripts.ts src/lib/inline-scripts.test.ts
git commit -m "feat(lib): add pre-hydration theme and lang inline scripts"
```

---

### Task 14: useTheme hook

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useTheme.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/hooks/useTheme.test.tsx`:

```tsx
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "dark";
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("reads initial theme from document.documentElement.dataset.theme", () => {
    document.documentElement.dataset.theme = "light";
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe("light");
  });

  it("toggling flips between dark and light", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current[0]).toBe("dark");
    act(() => result.current[1]());
    expect(result.current[0]).toBe("light");
    act(() => result.current[1]());
    expect(result.current[0]).toBe("dark");
  });

  it("toggling writes data-theme attribute on documentElement", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current[1]());
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("toggling persists to localStorage under miia.theme", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current[1]());
    expect(localStorage.getItem("miia.theme")).toBe("light");
  });
});
```

- [ ] **Step 2: Run, verify failure**

Run: `npm test -- --run src/hooks/useTheme.test.tsx`

Expected: fail with module not found.

- [ ] **Step 3: Create `src/hooks/useTheme.ts`**

```ts
import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

function readInitial(): Theme {
  if (typeof document === "undefined") return "dark";
  const ds = document.documentElement.dataset.theme;
  return ds === "light" ? "light" : "dark";
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("miia.theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test -- --run src/hooks/useTheme.test.tsx`

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTheme.ts src/hooks/useTheme.test.tsx
git commit -m "feat(hooks): add useTheme with SSG-safe initialization"
```

---

### Task 15: Telegram URL constant + useTelegramUrl hook

**Files:**
- Create: `src/lib/constants.ts`
- Create: `src/hooks/useTelegramUrl.ts`

- [ ] **Step 1: Create `src/lib/constants.ts`**

```ts
export const TELEGRAM_BOT_URL = "https://t.me/AIEverydayHelper_bot";
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://miia.example.com";
```

- [ ] **Step 2: Create `src/hooks/useTelegramUrl.ts`**

```ts
import { TELEGRAM_BOT_URL } from "../lib/constants";

export function useTelegramUrl(): string {
  return TELEGRAM_BOT_URL;
}
```

The indirection keeps consumers decoupled from the constant — future change (UTM params, A/B routing) goes inside the hook.

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts src/hooks/useTelegramUrl.ts
git commit -m "feat: centralize telegram url and site url constants"
```

---

## Phase 5 — Shared components

### Task 16: Icon component (inline SVGs from prototype)

**Files:**
- Create: `src/components/Icon/Icon.tsx`
- Create: `src/components/Icon/icons.tsx`

- [ ] **Step 1: Create `src/components/Icon/icons.tsx`**

Open `design/Miia Site.html`. Search for `<svg`. For each unique SVG, give it a name (e.g. `arrowExternal`, `sun`, `moon`, `chevron`, `globe`, `paperPlane`, `mic`, `attachment`, `sendCircle`, `checkmark`, `arrowUpRight`, etc.) and copy its inner content into the `icons` map below.

```tsx
import type { ReactNode } from "react";

export const icons: Record<string, ReactNode> = {
  arrowExternal: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  sun: (
    /* lift from prototype */
    <svg aria-hidden="true">{/* paths */}</svg>
  ),
  moon: (
    /* lift from prototype */
    <svg aria-hidden="true">{/* paths */}</svg>
  ),
  /* … one entry per unique inline SVG in the prototype, copied verbatim */
};

export type IconName = keyof typeof icons;
```

For every entry, copy the SVG element from the prototype exactly (preserving `viewBox`, paths, fills) and add `aria-hidden="true"` to the root `<svg>`.

- [ ] **Step 2: Create `src/components/Icon/Icon.tsx`**

```tsx
import { icons, type IconName } from "./icons";

export function Icon({ name }: { name: IconName }) {
  return icons[name] ?? null;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Icon/
git commit -m "feat(components): add Icon library lifted from prototype svgs"
```

---

### Task 17: Button component (primary gradient + ghost)

**Files:**
- Create: `src/components/Button/Button.tsx`
- Create: `src/components/Button/Button.module.css`
- Create: `src/components/Button/Button.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/Button/Button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders an <a> when href is provided", () => {
    render(<Button href="/foo">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/foo");
  });

  it("renders a <button> when no href is provided", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });

  it("calls onClick handler", async () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("applies variant attribute for styling", () => {
    render(<Button variant="ghost">G</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "ghost");
  });

  it("opens external links in a new tab securely", () => {
    render(<Button href="https://example.com" external>Open</Button>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npm test -- --run src/components/Button/Button.test.tsx`

Expected: fail (module not found).

- [ ] **Step 3: Create `src/components/Button/Button.module.css`**

Lift the prototype's `.btn-primary` and `.btn-ghost` rules from `design/Miia Site.html`. Replace selectors with `.button[data-variant="primary"]` / `.button[data-variant="ghost"]`.

```css
.button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 15px;
  letter-spacing: -0.005em;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.25s ease;
  position: relative;
}

.button[data-variant="primary"] {
  background: linear-gradient(135deg, var(--blue), var(--amber));
  color: var(--ink);
  box-shadow:
    0 12px 28px rgba(107, 182, 240, 0.25),
    0 4px 10px rgba(245, 161, 102, 0.18);
}

.button[data-variant="primary"]:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 34px rgba(107, 182, 240, 0.32),
    0 6px 14px rgba(245, 161, 102, 0.24);
}

.button[data-variant="ghost"] {
  border: 1px solid var(--line-2);
  color: var(--text);
  background: transparent;
}

.button[data-variant="ghost"]:hover {
  background: var(--blue-soft);
  border-color: var(--blue);
}
```

- [ ] **Step 4: Create `src/components/Button/Button.tsx`**

```tsx
import type { ReactNode, MouseEvent } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  "aria-label"?: string;
};

export function Button({
  children,
  variant = "primary",
  href,
  external,
  onClick,
  className,
  ...rest
}: ButtonProps) {
  const cls = [styles.button, className].filter(Boolean).join(" ");
  if (href) {
    return (
      <a
        href={href}
        data-variant={variant}
        className={cls}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" data-variant={variant} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npm test -- --run src/components/Button/Button.test.tsx`

Expected: 5 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/Button/
git commit -m "feat(components): add Button with primary and ghost variants"
```

---

### Task 18: ThemeToggle component

**Files:**
- Create: `src/components/ThemeToggle/ThemeToggle.tsx`
- Create: `src/components/ThemeToggle/ThemeToggle.module.css`

- [ ] **Step 1: Create `src/components/ThemeToggle/ThemeToggle.module.css`**

Lift the prototype's `.theme-btn`, `.icon-sun`, `.icon-moon` rules (and the swap animation). Search the prototype for `theme-btn`.

```css
.toggle {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg-2);
  position: relative;
  color: var(--text);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.toggle:hover {
  border-color: var(--blue);
  color: var(--blue);
}

.icon {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transition:
    transform 0.45s cubic-bezier(0.5, 1.5, 0.5, 1),
    opacity 0.3s ease;
}

[data-theme="dark"] .iconSun {
  transform: translateY(28px) rotate(90deg);
  opacity: 0;
}
[data-theme="dark"] .iconMoon {
  transform: translateY(0) rotate(0);
  opacity: 1;
}
[data-theme="light"] .iconSun {
  transform: translateY(0) rotate(0);
  opacity: 1;
}
[data-theme="light"] .iconMoon {
  transform: translateY(-28px) rotate(-90deg);
  opacity: 0;
}
```

- [ ] **Step 2: Create `src/components/ThemeToggle/ThemeToggle.tsx`**

```tsx
import { useTheme } from "~/hooks/useTheme";
import { Icon } from "../Icon/Icon";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [, toggle] = useTheme();
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <span className={`${styles.icon} ${styles.iconSun}`}>
        <Icon name="sun" />
      </span>
      <span className={`${styles.icon} ${styles.iconMoon}`}>
        <Icon name="moon" />
      </span>
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ThemeToggle/
git commit -m "feat(components): add ThemeToggle with sun/moon swap animation"
```

---

### Task 19: LangSwitcher component

**Files:**
- Create: `src/components/LangSwitcher/LangSwitcher.tsx`
- Create: `src/components/LangSwitcher/LangSwitcher.module.css`
- Create: `src/components/LangSwitcher/Flag.tsx`

- [ ] **Step 1: Create `src/components/LangSwitcher/Flag.tsx`**

Lift the prototype's CSS-drawn flag styles (look for `.flag.en`, `.flag.uk`, `.flag.pl` in the prototype). Provide them as inline-styled spans:

```tsx
import type { Locale } from "~/i18n/config";

const FLAG_STYLES: Record<Locale, React.CSSProperties> = {
  en: {
    /* lift from prototype .flag.en */
    background: "linear-gradient(/* … */)",
  },
  uk: {
    background: "linear-gradient(180deg, #0057B7 50%, #FFD500 50%)",
  },
  pl: {
    background: "linear-gradient(180deg, #ffffff 50%, #DC143C 50%)",
  },
};

export function Flag({ locale }: { locale: Locale }) {
  return (
    <span
      aria-hidden="true"
      style={{
        ...FLAG_STYLES[locale],
        display: "inline-block",
        width: 18,
        height: 12,
        borderRadius: 2,
        border: "1px solid var(--line)",
      }}
    />
  );
}
```

- [ ] **Step 2: Create `src/components/LangSwitcher/LangSwitcher.module.css`**

Lift the prototype's `.lang-btn`, `.lang-menu`, `.lang-menu .item`, `.lang-menu .item.active` rules. Adjust class names for CSS Modules:

```css
.wrap { position: relative; }

.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg-2);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.button:hover { border-color: var(--blue); color: var(--blue); }

.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 50;
}

.menu[data-open="true"] {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-2);
}

.item:hover { background: var(--blue-soft); color: var(--text); }
.item[data-active="true"] { color: var(--text); }

.itemMain { display: flex; flex-direction: column; gap: 2px; }
.itemNative { font-size: 14px; }
.itemEnglish { font-size: 11px; color: var(--text-3); font-family: var(--font-mono); letter-spacing: 0.06em; }
.check { margin-left: auto; opacity: 0; }
.item[data-active="true"] .check { opacity: 1; color: var(--blue); }
```

- [ ] **Step 3: Create `src/components/LangSwitcher/LangSwitcher.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { supportedLanguages, type Locale } from "~/i18n/config";
import { Icon } from "../Icon/Icon";
import { Flag } from "./Flag";
import styles from "./LangSwitcher.module.css";

const NATIVE: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
  pl: "Polski",
};

function pathForLocale(locale: Locale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

export function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const current = (i18n.language as Locale) || "en";

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function selectLocale(locale: Locale, e: React.MouseEvent) {
    e.preventDefault();
    try {
      localStorage.setItem("miia.lang", locale);
    } catch {}
    setOpen(false);
    navigate(pathForLocale(locale));
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Icon name="globe" />
        {current.toUpperCase()}
        <Icon name="chevron" />
      </button>
      <div className={styles.menu} data-open={open} role="menu">
        {supportedLanguages.map((loc) => (
          <a
            key={loc}
            href={pathForLocale(loc)}
            className={styles.item}
            data-active={loc === current}
            onClick={(e) => selectLocale(loc, e)}
            role="menuitem"
          >
            <Flag locale={loc} />
            <span className={styles.itemMain}>
              <span className={styles.itemNative}>{NATIVE[loc]}</span>
              <span className={styles.itemEnglish}>{t(`lang.${loc}`)}</span>
            </span>
            <span className={styles.check}>
              <Icon name="checkmark" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/LangSwitcher/
git commit -m "feat(components): add LangSwitcher with locale-prefix navigation"
```

---

## Phase 6 — Landing sections

For each section in Tasks 20–26 the workflow is:

1. **Open `design/Miia Site.html`** and locate the corresponding section markup + CSS.
2. **Create `Section.module.css`** — lift the CSS rules into a CSS Module file, replacing IDs/global classes with camelCase module classes and `:root`-derived tokens (which are already `var(--…)` references in the prototype).
3. **Create `Section.tsx`** — port the markup to JSX, replacing static text with `t('…')` calls and using `<Trans>` where the i18n string contains `<em1>` / `<em2>` tokens.
4. **Verify by running `npm run dev`** and visually diffing against the prototype.
5. **Commit.**

### Task 20: Nav section

**Files:**
- Create: `src/sections/Nav/Nav.tsx`
- Create: `src/sections/Nav/Nav.module.css`

- [ ] **Step 1: Create `src/sections/Nav/Nav.module.css`**

Lift `.nav`, `.nav-inner`, `.brand`, `.nav-links`, `.nav-right` from the prototype.

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(16px);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--line);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brandLogo {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  object-fit: cover;
}

.brandText {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brandName {
  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.01em;
}

.brandSub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.links {
  display: flex;
  gap: 28px;
}

.linkItem {
  color: var(--text-2);
  font-size: 14px;
  transition: color 0.18s ease;
}

.linkItem:hover { color: var(--text); }

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 760px) {
  .links { display: none; }
}
```

- [ ] **Step 2: Create `src/sections/Nav/Nav.tsx`**

```tsx
import logoUrl from "~/assets/miia-logo.jpg?w=72&format=webp&imagetools";
import logoFallback from "~/assets/miia-logo.jpg?w=72&format=jpg&imagetools";
import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";
import { LangSwitcher } from "~/components/LangSwitcher/LangSwitcher";
import { ThemeToggle } from "~/components/ThemeToggle/ThemeToggle";
import { useT } from "~/i18n/useT";
import { useTelegramUrl } from "~/hooks/useTelegramUrl";
import styles from "./Nav.module.css";

export function Nav() {
  const { t } = useT();
  const botUrl = useTelegramUrl();
  return (
    <nav className={styles.nav}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={styles.brand}>
          <picture>
            <source srcSet={logoUrl} type="image/webp" />
            <img src={logoFallback} alt="" className={styles.brandLogo} width="36" height="36" />
          </picture>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{t("nav.brand")}</span>
            <span className={styles.brandSub}>{t("nav.brandSub")}</span>
          </span>
        </a>
        <div className={styles.links}>
          <a href="#capabilities" className={styles.linkItem}>{t("nav.links.capabilities")}</a>
          <a href="#how" className={styles.linkItem}>{t("nav.links.how")}</a>
          <a href="#support" className={styles.linkItem}>{t("nav.links.support")}</a>
        </div>
        <div className={styles.right}>
          <ThemeToggle />
          <LangSwitcher />
          <Button href={botUrl} external>
            {t("nav.openInTelegram")}
            <Icon name="arrowExternal" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
```

The `~/assets/miia-logo.jpg` path requires the asset file — copy it now:

```bash
mkdir -p src/assets
cp "design/assets/miia-logo.jpg" src/assets/miia-logo.jpg
```

- [ ] **Step 3: Commit**

```bash
git add src/assets/miia-logo.jpg src/sections/Nav/
git commit -m "feat(nav): port nav section from prototype"
```

---

### Task 21: Hero section + PhonePreview

**Files:**
- Create: `src/sections/Hero/Hero.tsx`
- Create: `src/sections/Hero/Hero.module.css`
- Create: `src/sections/Hero/PhonePreview.tsx`
- Create: `src/sections/Hero/PhonePreview.module.css`

- [ ] **Step 1: Create `src/sections/Hero/Hero.module.css`**

Lift `.hero`, `.hero-grid`, `.eyebrow`, `.h1`, `.lede`, `.cta-row`, `.meta` from the prototype. Reference the README spec for exact font sizing (`clamp(48px, 6.4vw, 84px)` for H1).

```css
.section { padding: 96px 0 56px; }

.grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 80px;
  align-items: center;
}

@media (max-width: 980px) {
  .grid { grid-template-columns: 1fr; gap: 56px; }
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg-2);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-2);
  margin-bottom: 28px;
}

.eyebrowDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  animation: pulse 2.4s ease-in-out infinite;
}

.title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(48px, 6.4vw, 84px);
  letter-spacing: -0.035em;
  line-height: 1.05;
  margin-bottom: 28px;
}

.lede {
  font-size: 19px;
  color: var(--text-2);
  max-width: 540px;
  margin-bottom: 32px;
}

.ctaRow {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.meta {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--text-3);
}
```

- [ ] **Step 2: Create `src/sections/Hero/Hero.tsx`**

```tsx
import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";
import { Trans } from "~/i18n/Trans";
import { useT } from "~/i18n/useT";
import { useTelegramUrl } from "~/hooks/useTelegramUrl";
import { PhonePreview } from "./PhonePreview";
import styles from "./Hero.module.css";

export function Hero() {
  const { t } = useT();
  const botUrl = useTelegramUrl();
  return (
    <section className={styles.section}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            {t("hero.eyebrow")}
          </div>
          <h1 className={styles.title}>
            <Trans>{t("hero.title.line1")}</Trans>
            <br />
            <Trans>{t("hero.title.line2")}</Trans>
          </h1>
          <p className={styles.lede}>{t("hero.lede")}</p>
          <div className={styles.ctaRow}>
            <Button href={botUrl} external variant="primary">
              <Icon name="paperPlane" />
              {t("hero.cta.primary")}
            </Button>
            <Button href="#capabilities" variant="ghost">
              {t("hero.cta.ghost")}
            </Button>
          </div>
          <div className={styles.meta}>{t("hero.meta")}</div>
        </div>
        <PhonePreview />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/sections/Hero/PhonePreview.module.css`**

Lift `.phone`, `.phone-header`, `.msg`, `.msg.user`, `.msg.bot`, `.compose`, `.orb`, `.corner-label` from the prototype. Animation delays for the 4 messages: `.2s, 1.2s, 2.4s, 3.4s`. Always-dark internals regardless of theme — wrap with `[data-phone-theme="dark"]` and force colors.

(This is the largest CSS block in the whole project — ~150 lines. Lift verbatim from prototype.)

- [ ] **Step 4: Create `src/sections/Hero/PhonePreview.tsx`**

```tsx
import { Icon } from "~/components/Icon/Icon";
import styles from "./PhonePreview.module.css";

export function PhonePreview() {
  return (
    <div className={styles.wrap} data-phone-theme="dark">
      <div className={`${styles.orb} ${styles.orbBlue}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbAmber}`} aria-hidden="true" />

      <div className={styles.phone}>
        <div className={styles.header}>
          <div className={styles.avatar} aria-hidden="true" />
          <div className={styles.headerMain}>
            <div className={styles.name}>Miia</div>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              online
            </div>
          </div>
          <span className={styles.menu} aria-hidden="true">⋮</span>
        </div>

        <div className={styles.messages}>
          <div className={`${styles.msg} ${styles.user}`} style={{ animationDelay: "0.2s" }}>
            Make me a hero image of a fox in a circuit forest, 16:9
          </div>
          <div className={`${styles.msg} ${styles.bot}`} style={{ animationDelay: "1.2s" }}>
            <div className={styles.tag}>image · gemini</div>
            <div>Generating at 1920×1080…</div>
            <div className={styles.imgStub} aria-hidden="true" />
          </div>
          <div className={`${styles.msg} ${styles.user}`} style={{ animationDelay: "2.4s" }}>
            Now read this PDF and summarize chapter 3
          </div>
          <div className={`${styles.msg} ${styles.bot}`} style={{ animationDelay: "3.4s" }}>
            <div className={styles.typing} aria-hidden="true">
              <span /><span /><span />
            </div>
          </div>
        </div>

        <div className={styles.compose}>
          <Icon name="attachment" />
          <span className={styles.placeholder}>Message Miia…</span>
          <Icon name="mic" />
          <span className={styles.send}><Icon name="sendCircle" /></span>
        </div>
      </div>

      <span className={`${styles.cornerLabel} ${styles.cornerTopLeft}`}>01 · CHAT</span>
      <span className={`${styles.cornerLabel} ${styles.cornerBottomRight}`}>auto-model · gpt → gemini</span>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/sections/Hero/
git commit -m "feat(hero): port hero section and animated phone preview"
```

---

### Task 22: WhyMiia section

**Files:**
- Create: `src/sections/WhyMiia/WhyMiia.tsx`
- Create: `src/sections/WhyMiia/WhyMiia.module.css`

- [ ] **Step 1: Create `src/sections/WhyMiia/WhyMiia.module.css`**

Lift `.why`, `.why-grid`, `.why-card` from prototype. 3-column grid, 24px gap, stacks below 880px. Cards have 18px radius, 1px border, gradient surface, 32×28 padding, animated rainbow line at top (`linear-gradient(90deg, var(--blue), var(--amber))`).

```css
.section { padding: 96px 0; }

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr; }
}

.card {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 32px 28px;
  background: linear-gradient(180deg, var(--card-grad-from), var(--card-grad-to));
  overflow: hidden;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--blue), var(--amber));
  opacity: 0.6;
}

.numeral {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 22px;
  color: var(--amber);
  margin-bottom: 16px;
}

.title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 22px;
  letter-spacing: -0.015em;
  line-height: 1.15;
  margin-bottom: 12px;
}

.body { color: var(--text-2); font-size: 15px; }
```

- [ ] **Step 2: Create `src/sections/WhyMiia/WhyMiia.tsx`**

```tsx
import { useT } from "~/i18n/useT";
import { Trans } from "~/i18n/Trans";
import styles from "./WhyMiia.module.css";

type WhyItem = { numeral: string; title: string; body: string };

export function WhyMiia() {
  const { t } = useT();
  const items = t("why", { returnObjects: true }) as WhyItem[];

  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.grid}>
          {items.map((item, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.numeral}>{item.numeral}</div>
              <h3 className={styles.title}>
                <Trans>{item.title}</Trans>
              </h3>
              <p className={styles.body}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/WhyMiia/
git commit -m "feat(why): port why-miia section, data-driven from i18n"
```

---

### Task 23: Capabilities bento grid

**Files:**
- Create: `src/sections/Capabilities/Capabilities.tsx`
- Create: `src/sections/Capabilities/Capabilities.module.css`
- Create: `src/sections/Capabilities/visuals.tsx`

The 7 cards have distinct mini-visuals (model chips, image tiles, voice bars, doc stack, vision boxes, link summary, thread list). Each is a small JSX/CSS snippet; lift them from the prototype as `<Visual0_Chat />`, `<Visual1_Image />`, etc. The card layout and grid is shared.

- [ ] **Step 1: Create `src/sections/Capabilities/Capabilities.module.css`**

```css
.section { padding: 56px 0 96px; }

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
}

@media (max-width: 1040px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
  .card { grid-column: span 4; }
}

@media (max-width: 700px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .card { grid-column: span 2; }
}

.card {
  position: relative;
  background: linear-gradient(180deg, var(--card-grad-from), var(--card-grad-to));
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 28px;
  transition: transform 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-3px);
  border-color: var(--line-2);
}

/* span sizes */
.card[data-span="3"] { grid-column: span 3; }
.card[data-span="2"] { grid-column: span 2; }

.num {
  position: absolute;
  top: 22px;
  right: 24px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-3);
}

.title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 22px;
  letter-spacing: -0.015em;
  line-height: 1.15;
  margin: 8px 0 8px;
}

.body {
  color: var(--text-2);
  font-size: 14px;
  margin-bottom: 18px;
}

.visual { margin-top: 8px; }
```

- [ ] **Step 2: Create `src/sections/Capabilities/visuals.tsx`**

For each of the 7 capability visuals in the prototype, lift the JSX skeleton:

```tsx
import { Icon } from "~/components/Icon/Icon";

export function VisualChat() {
  return (
    <div>
      {/* lift .chips block from prototype */}
    </div>
  );
}

export function VisualImage() {
  return (
    <div>
      {/* lift .img-tiles block */}
    </div>
  );
}

export function VisualVoice() {
  return (
    <div>
      {/* 20 animated bars, lift .voice-bars */}
    </div>
  );
}

export function VisualDocs() {
  return (
    <div>
      {/* PDF stack + search input with blinking cursor */}
    </div>
  );
}

export function VisualVision() {
  return (
    <div>
      {/* mock image with object + OCR bounding boxes */}
    </div>
  );
}

export function VisualLinks() {
  return (
    <div>
      {/* youtube URL row + amber-bordered quote */}
    </div>
  );
}

export function VisualThreads() {
  return (
    <div>
      {/* 3-item thread list, active highlighted blue */}
    </div>
  );
}

export const visuals = [
  VisualChat,
  VisualImage,
  VisualVoice,
  VisualDocs,
  VisualVision,
  VisualLinks,
  VisualThreads,
];
```

Each `Visual*` component has its own small CSS file (e.g. `Visuals.module.css`) — lift each one's CSS rules from the prototype verbatim.

- [ ] **Step 3: Create `src/sections/Capabilities/Capabilities.tsx`**

```tsx
import { Trans } from "~/i18n/Trans";
import { useT } from "~/i18n/useT";
import styles from "./Capabilities.module.css";
import { visuals } from "./visuals";

const SPANS = [3, 3, 2, 2, 2, 3, 3] as const;

type Cap = { num: string; title: string; body: string };

export function Capabilities() {
  const { t } = useT();
  const caps = t("caps", { returnObjects: true }) as Cap[];
  return (
    <section className={styles.section} id="capabilities">
      <div className="wrap">
        <div className={styles.grid}>
          {caps.map((cap, i) => {
            const Visual = visuals[i];
            return (
              <div className={styles.card} data-span={SPANS[i]} key={i}>
                <div className={styles.num}>{cap.num}</div>
                <h3 className={styles.title}>
                  <Trans>{cap.title}</Trans>
                </h3>
                <p className={styles.body}>{cap.body}</p>
                <div className={styles.visual}>{Visual ? <Visual /> : null}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/sections/Capabilities/
git commit -m "feat(capabilities): port bento grid with 7 capability cards"
```

---

### Task 24: HowItWorks section

**Files:**
- Create: `src/sections/HowItWorks/HowItWorks.tsx`
- Create: `src/sections/HowItWorks/HowItWorks.module.css`

- [ ] **Step 1: Create `src/sections/HowItWorks/HowItWorks.module.css`**

Lift `.how`, `.how-panel`, `.step` from prototype. Single panel with 1px border, 20px radius, 3 columns, internal dividers, mono "STEP NN" labels.

```css
.section { padding: 96px 0; }

.panel {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: linear-gradient(180deg, var(--card-grad-from), var(--card-grad-to));
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
}

@media (max-width: 880px) {
  .panel { grid-template-columns: 1fr; }
}

.step {
  padding: 40px 36px;
  border-right: 1px solid var(--line);
}

.step:last-child { border-right: 0; }

@media (max-width: 880px) {
  .step { border-right: 0; border-bottom: 1px solid var(--line); }
  .step:last-child { border-bottom: 0; }
}

.label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--blue);
  margin-bottom: 20px;
}

.labelLine {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--blue), transparent);
}

.title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 22px;
  letter-spacing: -0.015em;
  line-height: 1.15;
  margin-bottom: 10px;
}

.body { color: var(--text-2); font-size: 15px; }
```

- [ ] **Step 2: Create `src/sections/HowItWorks/HowItWorks.tsx`**

```tsx
import { useT } from "~/i18n/useT";
import styles from "./HowItWorks.module.css";

type Step = { label: string; title: string; body: string };

export function HowItWorks() {
  const { t } = useT();
  const steps = t("how", { returnObjects: true }) as Step[];
  return (
    <section className={styles.section} id="how">
      <div className="wrap">
        <div className={styles.panel}>
          {steps.map((s, i) => (
            <div className={styles.step} key={i}>
              <div className={styles.label}>
                <span>{s.label}</span>
                <span className={styles.labelLine} />
              </div>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.body}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/HowItWorks/
git commit -m "feat(how): port how-it-works section, data-driven"
```

---

### Task 25: FinalCTA section

**Files:**
- Create: `src/sections/FinalCTA/FinalCTA.tsx`
- Create: `src/sections/FinalCTA/FinalCTA.module.css`

- [ ] **Step 1: Create `src/sections/FinalCTA/FinalCTA.module.css`**

Lift `.final-cta`, atmosphere orbs, gradient primary button from prototype.

```css
.section {
  position: relative;
  padding: 120px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  text-align: center;
  overflow: hidden;
}

.orbBlue,
.orbAmber {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.35;
  pointer-events: none;
}

.orbBlue {
  background: radial-gradient(circle, var(--blue) 0%, transparent 60%);
  top: 50%;
  left: -200px;
  transform: translateY(-50%);
}

.orbAmber {
  background: radial-gradient(circle, var(--amber) 0%, transparent 60%);
  top: 50%;
  right: -200px;
  transform: translateY(-50%);
}

.inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
}

.title {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(40px, 5.4vw, 72px);
  letter-spacing: -0.035em;
  line-height: 1.05;
  margin-bottom: 24px;
}

.lede {
  font-size: 19px;
  color: var(--text-2);
  margin-bottom: 36px;
}
```

- [ ] **Step 2: Create `src/sections/FinalCTA/FinalCTA.tsx`**

```tsx
import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";
import { Trans } from "~/i18n/Trans";
import { useT } from "~/i18n/useT";
import { useTelegramUrl } from "~/hooks/useTelegramUrl";
import styles from "./FinalCTA.module.css";

export function FinalCTA() {
  const { t } = useT();
  const botUrl = useTelegramUrl();
  return (
    <section className={styles.section}>
      <div className={styles.orbBlue} aria-hidden="true" />
      <div className={styles.orbAmber} aria-hidden="true" />
      <div className="wrap">
        <div className={styles.inner}>
          <h2 className={styles.title}>
            <Trans>{t("cta.title")}</Trans>
          </h2>
          <p className={styles.lede}>{t("cta.lede")}</p>
          <Button href={botUrl} external variant="primary">
            <Icon name="paperPlane" />
            {t("cta.button")}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/FinalCTA/
git commit -m "feat(cta): port final cta section with atmosphere orbs"
```

---

### Task 26: Footer section

**Files:**
- Create: `src/sections/Footer/Footer.tsx`
- Create: `src/sections/Footer/Footer.module.css`

- [ ] **Step 1: Create `src/sections/Footer/Footer.module.css`**

```css
.footer { padding: 96px 0 48px; border-top: 1px solid var(--line); }

.grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}

@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr 1fr; }
}

.brandCol { max-width: 320px; }

.brandRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.brandText { font-weight: 500; }

.tagline {
  color: var(--text-2);
  font-size: 14px;
  line-height: 1.55;
}

.colTitle {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 20px;
}

.linkList { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-2);
  font-size: 14px;
  transition: color 0.18s ease;
}

.link:hover { color: var(--text); }

.link:hover .arrow {
  color: var(--amber);
  transform: translate(2px, -2px);
}

.arrow {
  transition: transform 0.18s ease, color 0.18s ease;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--line);
  padding-top: 32px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-3);
  text-transform: uppercase;
}
```

- [ ] **Step 2: Create `src/sections/Footer/Footer.tsx`**

```tsx
import logoUrl from "~/assets/miia-logo.jpg?w=72&format=webp&imagetools";
import logoFallback from "~/assets/miia-logo.jpg?w=72&format=jpg&imagetools";
import { useT } from "~/i18n/useT";
import styles from "./Footer.module.css";

type FooterLink = { label: string; href: string };
type FooterCol = { title: string; links: FooterLink[] };

export function Footer() {
  const { t } = useT();
  const cols = t("footer.columns", { returnObjects: true }) as FooterCol[];
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} id="support">
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brandRow}>
              <picture>
                <source srcSet={logoUrl} type="image/webp" />
                <img src={logoFallback} alt="" width="36" height="36" style={{ borderRadius: 999 }} />
              </picture>
              <span className={styles.brandText}>{t("nav.brand")}</span>
            </div>
            <p className={styles.tagline}>{t("nav.brandSub")}</p>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div className={styles.colTitle}>{col.title}</div>
              <ul className={styles.linkList}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    {/* TODO: replace `#` placeholders with real destinations */}
                    <a href={link.href} className={styles.link}>
                      {link.label}
                      <span className={styles.arrow}>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>© {year} Miia</span>
          <span>{t("footer.bottom")}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/sections/Footer/
git commit -m "feat(footer): port footer with placeholder link destinations"
```

---

## Phase 7 — Landing route assembly + locale resolution

### Task 27: Assemble landing route with locale resolution

**Files:**
- Modify: `src/routes/landing.tsx`

- [ ] **Step 1: Update `src/routes/landing.tsx`**

```tsx
import { useEffect } from "react";
import { useMatches } from "react-router";
import { setupI18n, type Locale } from "~/i18n/config";
import { Capabilities } from "~/sections/Capabilities/Capabilities";
import { FinalCTA } from "~/sections/FinalCTA/FinalCTA";
import { Footer } from "~/sections/Footer/Footer";
import { Hero } from "~/sections/Hero/Hero";
import { HowItWorks } from "~/sections/HowItWorks/HowItWorks";
import { Nav } from "~/sections/Nav/Nav";
import { WhyMiia } from "~/sections/WhyMiia/WhyMiia";

function localeFromRouteId(id: string): Locale {
  if (id === "landing-uk") return "uk";
  if (id === "landing-pl") return "pl";
  return "en";
}

export default function Landing() {
  const matches = useMatches();
  const routeMatch = matches[matches.length - 1];
  const locale = localeFromRouteId(routeMatch?.id ?? "");

  setupI18n(locale);

  useEffect(() => {
    setupI18n(locale);
  }, [locale]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhyMiia />
        <Capabilities />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
```

`setupI18n` is called both during render (so prerendered HTML contains translated strings) and in `useEffect` (so client-side navigation between locales also updates).

- [ ] **Step 2: Run dev server, check `/`, `/uk`, `/pl`**

Run: `npm run dev`

Open browser to `http://localhost:5173/` — page renders in English.
Navigate to `/uk` — page renders in Ukrainian.
Navigate to `/pl` — page renders in Polish.

- [ ] **Step 3: Commit**

```bash
git add src/routes/landing.tsx
git commit -m "feat(landing): assemble sections and wire locale resolution"
```

---

## Phase 8 — SEO meta tags + sitemap

### Task 28: Per-locale meta tags via `meta` export

**Files:**
- Modify: `src/routes/landing.tsx`
- Modify: `src/root.tsx`

- [ ] **Step 1: Add `meta` export to `src/routes/landing.tsx`**

Above the `Landing` component, add:

```tsx
import type { MetaFunction } from "react-router";
import { resources } from "~/i18n/config";
import { SITE_URL } from "~/lib/constants";

export const meta: MetaFunction = (args) => {
  const id = args.matches[args.matches.length - 1]?.id ?? "";
  const locale = id === "landing-uk" ? "uk" : id === "landing-pl" ? "pl" : "en";
  const t = resources[locale].translation as { meta: { title: string; description: string } };
  const path = locale === "en" ? "/" : `/${locale}/`;
  const url = `${SITE_URL}${path}`;
  const ogImage = `${SITE_URL}/og-image.png`;

  return [
    { title: t.meta.title },
    { name: "description", content: t.meta.description },
    { property: "og:title", content: t.meta.title },
    { property: "og:description", content: t.meta.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:locale", content: locale === "uk" ? "uk_UA" : locale === "pl" ? "pl_PL" : "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: t.meta.title },
    { name: "twitter:description", content: t.meta.description },
    { name: "twitter:image", content: ogImage },
    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: `${SITE_URL}/` },
    { tagName: "link", rel: "alternate", hrefLang: "uk", href: `${SITE_URL}/uk/` },
    { tagName: "link", rel: "alternate", hrefLang: "pl", href: `${SITE_URL}/pl/` },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/` },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Miia",
        url: SITE_URL,
        inLanguage: locale,
      },
    },
  ];
};
```

- [ ] **Step 2: Update `<html lang>` per route in `src/root.tsx`**

Replace the static `<html lang="dark">` with locale-aware rendering using route ID:

```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches } from "react-router";
import type { LinksFunction } from "react-router";
import { themeScript, langRedirectScript } from "./lib/inline-scripts";

import resetHref from "./styles/reset.css?url";
import tokensHref from "./styles/tokens.css?url";
import fontsHref from "./styles/fonts.css?url";
import animationsHref from "./styles/animations.css?url";
import globalHref from "./styles/global.css?url";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: resetHref },
  { rel: "stylesheet", href: tokensHref },
  { rel: "stylesheet", href: fontsHref },
  { rel: "stylesheet", href: animationsHref },
  { rel: "stylesheet", href: globalHref },
];

export default function Root() {
  const matches = useMatches();
  const id = matches[matches.length - 1]?.id ?? "";
  const lang = id === "landing-uk" ? "uk" : id === "landing-pl" ? "pl" : "en";

  return (
    <html lang={lang} data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: langRedirectScript }} />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

`dangerouslySetInnerHTML` is appropriate here: these are inline scripts (not arbitrary user input), needed before hydration. Both scripts are static, defined in our own code.

- [ ] **Step 3: Commit**

```bash
git add src/routes/landing.tsx src/root.tsx
git commit -m "feat(seo): per-locale meta tags, hreflang, canonical, og, jsonld"
```

---

### Task 29: robots.txt + sitemap generator

**Files:**
- Create: `public/robots.txt`
- Create: `scripts/generate-sitemap.ts`

- [ ] **Step 1: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://miia.example.com/sitemap.xml
```

(Engineer: replace `miia.example.com` with the real production hostname once known, or templatize via env.)

- [ ] **Step 2: Create `scripts/generate-sitemap.ts`**

```ts
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = process.env.VITE_SITE_URL ?? "https://miia.example.com";
const routes: { path: string; locale: "en" | "uk" | "pl" }[] = [
  { path: "/", locale: "en" },
  { path: "/uk/", locale: "uk" },
  { path: "/pl/", locale: "pl" },
];

const now = new Date().toISOString().slice(0, 10);

function urlEntry(path: string): string {
  const url = `${SITE_URL}${path}`;
  const alternates = routes
    .map(
      (r) =>
        `    <xhtml:link rel="alternate" hreflang="${r.locale}" href="${SITE_URL}${r.path}"/>`,
    )
    .join("\n");
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map((r) => urlEntry(r.path)).join("\n")}
</urlset>
`;

const out = join(process.cwd(), "build", "client", "sitemap.xml");
writeFileSync(out, xml, "utf-8");
console.log(`Wrote ${out}`);
```

- [ ] **Step 3: Run the build to verify sitemap generation**

Run: `npm run build`

Expected: build completes, terminal logs `Wrote .../build/client/sitemap.xml`. Inspect the file.

- [ ] **Step 4: Verify prerendered HTML has translated content**

Run:
```bash
grep -o '<h1[^<]*<' build/client/uk/index.html | head -1
grep -o '<h1[^<]*<' build/client/pl/index.html | head -1
```

Expected: each grep returns a `<h1` with Ukrainian / Polish text (not English placeholders, not blank).

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt scripts/generate-sitemap.ts
git commit -m "feat(seo): add robots.txt and sitemap generator"
```

---

## Phase 9 — Analytics

### Task 30: GA4 integration

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `.env.example`
- Modify: `src/entry.client.tsx`
- Modify: `src/routes/landing.tsx`

- [ ] **Step 1: Create `.env.example`**

```
VITE_GA_MEASUREMENT_ID=
VITE_SITE_URL=https://miia.example.com
```

- [ ] **Step 2: Create `src/lib/analytics.ts`**

```ts
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
  initialized = true;
}

export function pageview(path: string, locale: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id) return;
  window.gtag("event", "page_view", { page_path: path, page_location: window.location.href, language: locale });
}

type EventName = "open_telegram" | "theme_toggle" | "lang_switch";

export function event(name: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
```

- [ ] **Step 3: Wire `initAnalytics()` in `src/entry.client.tsx`**

```tsx
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { initAnalytics } from "./lib/analytics";

initAnalytics();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
```

- [ ] **Step 4: Wire pageview in landing route**

Update `src/routes/landing.tsx` — add at top of component, alongside the existing `useEffect`:

```tsx
import { useLocation } from "react-router";
import { pageview } from "~/lib/analytics";

// inside Landing component:
const location = useLocation();
useEffect(() => {
  pageview(location.pathname, locale);
}, [location.pathname, locale]);
```

- [ ] **Step 5: Wire event in Button onClick where it points to bot URL**

Already centralized via `TELEGRAM_BOT_URL` — we can wrap the Button or attach `onClick`. In Nav, Hero, FinalCTA, replace `<Button href={botUrl} external>…</Button>` with:

```tsx
import { event } from "~/lib/analytics";

<Button href={botUrl} external onClick={() => event("open_telegram", { surface: "hero" })}>…</Button>
```

Use surfaces `nav`, `hero`, `final`. Similarly add `event("theme_toggle")` in `ThemeToggle.tsx` and `event("lang_switch", { to: locale })` in `LangSwitcher.tsx`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/analytics.ts .env.example src/entry.client.tsx src/routes/landing.tsx src/components/ThemeToggle/ThemeToggle.tsx src/components/LangSwitcher/LangSwitcher.tsx src/sections/Nav/Nav.tsx src/sections/Hero/Hero.tsx src/sections/FinalCTA/FinalCTA.tsx
git commit -m "feat(analytics): wire GA4 page_view, open_telegram, theme_toggle, lang_switch"
```

---

## Phase 10 — Asset optimization & social image

### Task 31: Logo + OG image + favicon

**Files:**
- Create: `public/og-image.png`
- Create: `public/favicon.svg`

The logo asset is already at `src/assets/miia-logo.jpg`. `vite-imagetools` (configured in Task 2) generates webp variants on demand via the `?w=72&format=webp&imagetools` query string used in Nav/Footer.

- [ ] **Step 1: Generate `og-image.png` (1200×630)**

Easiest approach: open `design/Miia Site.html` in a browser, screenshot the hero at 1200×630 with the dark theme. Save as `public/og-image.png`.

Alternative: derive from `miia-logo.jpg` — center the logo on a 1200×630 navy canvas using any image tool. For a v1, the screenshot is fine.

- [ ] **Step 2: Create `public/favicon.svg`**

A minimal placeholder until a real favicon is provided:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6bb6f0"/>
      <stop offset="1" stop-color="#f5a166"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="#050b1a"/>
  <circle cx="32" cy="32" r="20" fill="url(#g)"/>
</svg>
```

- [ ] **Step 3: Verify both files load**

Run: `npm run dev`. Open `http://localhost:5173/favicon.svg` and `http://localhost:5173/og-image.png` — both should display.

- [ ] **Step 4: Commit**

```bash
git add public/og-image.png public/favicon.svg
git commit -m "feat(assets): add favicon and social og image"
```

---

## Phase 11 — Firebase Hosting setup & deploy

### Task 32: Firebase config + first deploy

**Files:**
- Create: `firebase.json`
- Create: `.firebaserc` (interactively by `firebase init`)

- [ ] **Step 1: Create `firebase.json`**

```jsonc
{
  "hosting": {
    "public": "build/client",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      {
        "source": "**/*.@(js|css|woff2|webp|avif|jpg|png|svg)",
        "headers": [{ "key": "Cache-Control", "value": "public,max-age=31536000,immutable" }]
      },
      {
        "source": "**/*.html",
        "headers": [{ "key": "Cache-Control", "value": "public,max-age=0,must-revalidate" }]
      }
    ],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

- [ ] **Step 2: Login + init Firebase (manual)**

This step requires interactive auth — run as the user:

```
! npx firebase login
! npx firebase init hosting
```

(The `!` prefix runs in this Claude session so output lands in conversation; for plain shell drop the `!`.)

During `firebase init hosting`:
- Use an existing project, or create new.
- Public dir: `build/client`.
- Single-page app rewrite: **No** (we handle it via `firebase.json` already, and we don't want all routes mapped to root).
- Overwrite `firebase.json`: **No** (we want our custom version to remain).

This creates `.firebaserc` with the project ID. Add `.firebaserc` to git (after verifying it contains no secrets — it shouldn't; just project IDs are fine).

- [ ] **Step 3: Set production environment variables**

Create `.env.production`:

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SITE_URL=https://your-firebase-project.web.app
```

(Replace with real values. `.env.production` is gitignored.)

- [ ] **Step 4: Build and inspect output**

Run: `npm run build`

Expected output:
```
build/client/index.html
build/client/uk/index.html
build/client/pl/index.html
build/client/sitemap.xml
build/client/robots.txt
build/client/favicon.svg
build/client/og-image.png
build/client/assets/   (hashed JS, CSS, fonts)
```

Verify:
```bash
ls -la build/client/{index.html,uk/index.html,pl/index.html,sitemap.xml,robots.txt}
```

- [ ] **Step 5: Deploy to a preview channel first**

```bash
npm run deploy:preview
```

Open the preview URL printed by Firebase. Verify: theme works, lang switcher navigates, no console errors, hero animations play.

- [ ] **Step 6: Deploy to production**

```bash
npm run deploy
```

Open the production URL.

- [ ] **Step 7: Commit**

```bash
git add firebase.json .firebaserc
git commit -m "feat(hosting): configure firebase hosting with cache headers"
```

---

## Phase 12 — Final verification

### Task 33: Lighthouse + visual diff + SEO checks

- [ ] **Step 1: Run Lighthouse on production URL**

Open Chrome DevTools → Lighthouse → analyze the production URL on Desktop, then Mobile.

Expected: all four scores ≥ 95. If anything is below:
- **Performance:** check that fonts are preloaded, images are webp, no render-blocking JS.
- **Accessibility:** check color contrast, label associations, landmark regions.
- **Best Practices:** check that no console errors, HTTPS, no deprecated APIs.
- **SEO:** check that `<title>`, `<meta description>`, canonical, hreflang are all present.

Iterate on any failing audit before declaring done.

- [ ] **Step 2: Visual diff vs prototype**

Open `design/Miia Site.html` in one tab and the production URL in another. Walk through each section:
- Nav: spacing, logo, link order, button styling
- Hero: title type sizes, gradient emphasis, phone preview animation timing
- Why Miia: card spacing, italic numerals, top gradient line
- Capabilities: bento grid column spans at all breakpoints
- How it works: 3-column panel with dividers
- Final CTA: orb glow positions, gradient button
- Footer: 4-column grid, `↗` hover animation

If any section drifts, screenshot both and reconcile against `README.md` design tokens. Don't improvise — return to the prototype values.

- [ ] **Step 3: SEO surface check**

For each of `/`, `/uk/`, `/pl/` on the production URL:
- View page source. Verify presence of:
  - `<html lang>` matching the locale
  - `<title>` and `<meta name="description">` in the right language
  - `<link rel="canonical">` pointing at the correct URL
  - 4 `<link rel="alternate" hreflang>` entries (en, uk, pl, x-default)
  - Open Graph + Twitter tags
  - JSON-LD `WebSite` schema
  - Real translated content (not empty `<div id="root">`)

Run:
```bash
curl -s https://<your-host>/uk/ | grep -c '<title>'
curl -s https://<your-host>/uk/ | grep '<html lang='
curl -s https://<your-host>/uk/ | grep 'hreflang='
```

- [ ] **Step 4: Theme + lang behavior**

In an incognito window:
- Set OS to light theme, visit `/` — page should load in light mode with no flash.
- Set browser language to Polish (or use a Polish device), visit `/` — should soft-redirect to `/pl`.
- Reload `/pl/` — preference sticks.

- [ ] **Step 5: Commit (and tag)**

```bash
git tag v0.1.0
git commit --allow-empty -m "chore: v0.1.0 — production launch"
```

---

## Self-Review

After the engineer has executed all tasks, sanity-check against the spec:

1. **Spec section 1 — Goals:** Lighthouse ≥ 95 (Task 33), three locales (Phase 3 + 7), themes (Phase 4), Firebase Hosting (Phase 11), bot URL (Task 15). ✓
2. **Spec section 3 — Project structure:** every directory in the structure tree is created by some task. ✓
3. **Spec section 4 — Rendering:** Tasks 1, 2, 5 establish `ssr: false` + `prerender`; Task 27 + 28 do per-locale meta. ✓
4. **Spec section 5 — Theming:** Task 13 inline script, Task 14 hook, Task 28 wires script into root. ✓
5. **Spec section 6 — i18n:** Tasks 9–12, 19, 27. Locale-prefix routes are in Task 5; locale resolution + `setupI18n` in Task 27. ✓
6. **Spec section 7 — SEO:** Task 28 + Task 29. Hreflang, canonical, OG, JSON-LD, robots, sitemap. ✓
7. **Spec section 8 — Performance:** Font preconnect (Task 8), font preload (add in Task 33 if Lighthouse flags), logo webp via vite-imagetools (Task 20 references already use it), caching headers (Task 32). ✓
8. **Spec section 9 — Analytics:** Task 30. ✓
9. **Spec section 10 — Firebase:** Task 32. ✓
10. **Spec section 11 — Constants:** Task 15. ✓
11. **Spec section 12 — Verification:** Task 33. ✓

---

## Plan complete.

**Total tasks:** 33 across 12 phases.

**Estimated session length for a fresh engineer:** ~6–10 working hours, depending on familiarity with React Router v7 framework mode. The visual-section ports (Tasks 20–26) are the bulk of the work and can be parallelized across multiple sessions.
