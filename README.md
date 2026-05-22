# Handoff: Miia — Telegram Bot Landing Site

## Overview

A single-page marketing site for **Miia**, a Telegram bot that wraps multiple top-tier
AI models (GPT, Gemini, Grok) behind one conversational interface. The site:

- Pitches what Miia is and why someone should try it
- Showcases all 7 capabilities as a bento-style card grid
- Drives the user to open the bot in Telegram
- Provides support / community / legal links in the footer
- Supports **3 languages** (English, Ukrainian, Polish) via an in-page switcher
- Supports **light and dark themes** via an in-page toggle

## About the Design Files

The HTML/CSS/JS in `design/` is a **design reference**, not production code. It was
prototyped as a single self-contained HTML file so you can see the final look and
all interactive behaviors in a browser.

**Your task is to recreate this design in a real codebase.** If you don't already
have a project, the recommended stack is:

- **Framework:** Next.js (App Router) or Astro — both are well-suited to a marketing
  site with light interactivity and SEO needs.
- **Styling:** Tailwind CSS with the design tokens below codified as CSS custom
  properties (so theming works the same way it does in the prototype).
- **i18n:** `next-intl` (Next) or Astro's built-in i18n. The translation dictionary
  is already authored in three languages inside the prototype — lift it.
- **Hosting:** Vercel, Netlify, or Cloudflare Pages.

If you already have a codebase, follow its existing framework, design-system, and
component conventions — don't drop raw HTML/CSS in.

## Fidelity

**High-fidelity.** Final colors, type pairings, spacing, animations, and
interactions are all decided. Recreate pixel-perfectly using the target codebase's
component library and styling system.

## Brand & Visual System

The visual system is derived from the Miia logo (`design/assets/miia-logo.jpg`):
a circular emblem with a cool-blue neural-network half and a warm-amber
circuit-board half over deep navy. The site's organizing metaphor is this
dual-tone duality — cool side / warm side, inputs / outputs.

### Color Tokens

**Dark theme (default)**
| Token | Value | Use |
|---|---|---|
| `--ink` | `#050b1a` | Deepest navy (text on accents) |
| `--bg` | `#0a1428` | Page background |
| `--bg-2` | `#0d1a35` | Elevated background (dropdowns) |
| `--panel` | `#122444` | Card background |
| `--panel-2` | `#16294f` | Card variant |
| `--line` | `#1f3868` | Borders |
| `--line-2` | `#284680` | Borders (stronger) |
| `--text` | `#e8eef7` | Primary text |
| `--text-2` | `#a9b8d4` | Secondary text |
| `--text-3` | `#6f82a8` | Tertiary text / labels |
| `--blue` | `#6bb6f0` | Cool accent (primary) |
| `--blue-2` | `#4a96d8` | Cool accent (darker) |
| `--blue-soft` | `rgba(107,182,240,.14)` | Cool accent surface |
| `--amber` | `#f5a166` | Warm accent (primary) |
| `--amber-2` | `#e88a4a` | Warm accent (darker) |
| `--amber-soft` | `rgba(245,161,102,.14)` | Warm accent surface |

**Light theme**
| Token | Value |
|---|---|
| `--bg` | `#f5f7fc` |
| `--bg-2` / `--panel` | `#ffffff` |
| `--panel-2` | `#f8fafd` |
| `--line` | `#e2e8f3` |
| `--line-2` | `#c4d0e4` |
| `--text` | `#0a1428` |
| `--text-2` | `#4a5a78` |
| `--text-3` | `#8896b3` |
| `--blue` | `#2876c4` |
| `--blue-2` | `#1c5ea3` |
| `--amber` | `#d97843` |
| `--amber-2` | `#b6562a` |

The complete CSS-custom-property override block (including all surface tokens like
`--nav-bg`, `--grid-color`, `--card-grad-from`, etc.) is in the prototype's
`<style>` under `[data-theme="light"]`. Lift the full block; don't re-derive.

**Note:** The "phone preview" component in the hero section is **always dark in
both themes** — it represents a Telegram chat screen, and the dark-on-light
contrast in light mode is intentional.

### Typography

Three Google Fonts, loaded together:

- **Space Grotesk** (weights 300–700) — Display + UI. Headings use weight 500 with
  tight letter-spacing (`-0.03em` to `-0.035em` on hero/section titles).
- **Instrument Serif** (italic) — Editorial accents only. Used inline within
  headings (e.g. *every*, *can do*, *co-pilot*) and as numerals (i. ii. iii.) on
  the "Why Miia" cards. Always italic.
- **JetBrains Mono** — Labels, eyebrows, metadata, model chips, technical UI
  (e.g. "01 / smart conversations", "STEP 01", thread counts).

Type scale:

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Hero H1 | `clamp(48px, 6.4vw, 84px)` | 500 | -0.035em |
| Section H2 | `clamp(34px, 4.4vw, 56px)` | 500 | -0.03em |
| Final-CTA H2 | `clamp(40px, 5.4vw, 72px)` | 500 | -0.035em |
| Card H3 | 22px | 500 | -0.015em |
| Body | 17px | 400 | normal |
| Lede | 19px | 400 | normal |
| Eyebrow / mono labels | 11–13px (Mono) | 400–500 | 0.04em–0.12em |

Line-height: 1.05 for huge titles, 1.15 for card titles, 1.55 for body.

### Spacing

The site uses an 8px-ish soft scale. Common values: 8, 10, 12, 14, 16, 18, 24, 28,
32, 48, 56, 80, 96, 120 px. Section vertical padding is `96px 0`. The page wraps
at `max-width: 1240px` with `padding: 0 32px`.

### Radii & Shadows

- Card radius: 18–20px
- Button / chip: 999px (pill)
- Phone preview: 28px
- Inputs: 8–10px

Shadows are theme-aware (see `--shadow-strong` / `--shadow-med` tokens in the
prototype). Buttons get a dual-tinted shadow:
`0 12px 28px rgba(107,182,240,.25), 0 4px 10px rgba(245,161,102,.18)`.

## Page Structure — Section by Section

### 1. Navigation (sticky)

- **Layout:** flex, full-width within `1240px` wrap, 16px vertical padding,
  `backdrop-filter: blur(16px)`, semi-transparent background, 1px bottom border.
- **Left:** circular logo avatar (36×36) + wordmark "Miia / AI for Telegram".
- **Center:** nav links — Capabilities, How it works, Support (hidden < 760px).
- **Right (nav-right group):**
  - Theme toggle (38×38 pill, animated sun↔moon swap)
  - Language switcher (pill button with globe + EN/UK/PL label + chevron,
    opens a 200px dropdown with flag, native name, and English label per option)
  - "Open in Telegram" CTA (white pill on dark / dark pill on light, with an
    external-link arrow icon)

### 2. Hero

- **Layout:** two-column grid (`1.05fr 1fr`), 80px gap, vertically centered.
  Stacks below 980px.
- **Left column:**
  - Eyebrow pill: "● LIVE · TELEGRAM BOT" (green pulsing dot)
  - H1 — two lines, large, with two italic-serif spans:
    "Your AI *co-pilot*, inside the chat *you already use*."
    The `co-pilot` span is gradient-clipped to blue; `you already use` to amber.
  - Lede paragraph (~3 lines, 540px max)
  - CTA row: primary `Open Miia in Telegram` (gradient pill: blue → amber, with
    Telegram paper-plane icon), ghost `See what it does` (border pill).
  - Meta row in mono: `FREE TO START · NO SIGN-UP · ~60s SETUP`.
- **Right column — animated chat preview ("phone"):**
  - Dark rounded card (`#0e1d3a → #0b1730`, 28px radius), border, deep shadow.
  - Two soft blurred orbs behind it (blue top-left, amber bottom-right) with slow
    `float1` / `float2` keyframe animations.
  - Phone header: Miia avatar, name, green "● online" status, ⋮ menu.
  - Messages: 4 chat bubbles that fade-in sequentially with `msgIn` keyframe
    (delays: .2s, 1.2s, 2.4s, 3.4s):
    1. User: "Make me a hero image of a fox in a circuit forest, 16:9"
    2. Bot (amber): `image · gemini` tag + "Generating at 1920×1080…" + a
       gradient-filled `.img-stub` preview block
    3. User: "Now read this PDF and summarize chapter 3"
    4. Bot: typing indicator (3 dots, staggered bounce, `typing` keyframe)
  - Compose bar: attachment icon, "Message Miia…" placeholder, mic icon,
    blue circular send button.
  - Corner labels positioned outside the phone (top-left "01 · CHAT", bottom-right
    "auto-model · gpt → gemini") with thin connector lines.

### 3. "Why Miia" (3 cards)

- 3-column grid, 24px gap, stacks below 880px.
- Each card: 18px radius, 1px border, gradient surface, 32×28 padding, a
  thin animated rainbow line at the top (blue→amber gradient stripe).
- Content: italic-serif numeral (`i.` / `ii.` / `iii.` in amber), 22px title,
  paragraph.

### 4. Capabilities — Bento Grid (7 cards)

6-column grid, 18px gap. Span configuration:

| # | Card | Span | Visual |
|---|---|---|---|
| 01 | Smart conversations | 3 | 4 model chips (GPT routed active, Gemini, Grok, "auto-select" dashed) |
| 02 | Image generation | 3 | 4 gradient image tiles + dashed `+` tile |
| 03 | Voice | 2 | 20 animated bars, staggered `wave` keyframe |
| 04 | Documents | 2 | PDF stack + search input with blinking cursor |
| 05 | Vision | 2 | Mock image with two labeled bounding boxes ("object" / "OCR") |
| 06 | Links & video | 3 | YouTube URL row + amber-bordered summary quote |
| 07 | Threads | 3 | 3-item thread list, active one highlighted blue |

Cap title format: 22px, regular weight, with selective italic-serif emphasis
(`<em>`) for one word — e.g. "Chat with *top-tier* models, no menu needed".

Cap-num label sits at top-right of each card in mono, format `NN / category`.

Responsive: 4-column at ≤1040px (all cards span 4), 2-column at ≤700px (all
cards span 2).

### 5. How it works (3 steps)

- Single horizontal panel with 1px border, 20px radius, internal column dividers.
- 3 columns, each with a mono "STEP NN" label (followed by a thin gradient line),
  a 22px title, and a one-sentence description.

### 6. Final CTA

- Full-bleed section with two radial-gradient atmosphere orbs (blue left, amber
  right), 1px top + bottom borders, 120px vertical padding.
- Centered H2 with italic-serif accent ("every"), lede, gradient primary button.

### 7. Footer

- 4-column grid: `1.4fr 1fr 1fr 1fr`, 48px gap.
- Brand block + 3 link columns (Support, Community, Legal). Each link has an
  `↗` arrow that translates on hover.
- Bottom bar in mono: copyright + "BUILT FOR TELEGRAM · NOT AFFILIATED".

## Interactions & Behavior

### Theme Toggle

- Button in nav: 38×38 pill, sun + moon SVGs absolutely stacked.
- Click flips `<html data-theme="dark|light">`.
- Animated swap: outgoing icon translates 28px vertically + rotates 90°, fades
  out; incoming does the reverse. `0.45s cubic-bezier(.5,1.5,.5,1)` for transform.
- Persist via `localStorage["miia.theme"]`.
- On first visit, read `prefers-color-scheme`.

### Language Switcher

- Button in nav: globe + 2-letter code + chevron. Click toggles `.open` class.
- Outside click closes.
- Dropdown menu items: flag swatch (CSS-drawn — UK = blue/yellow stripes,
  PL = white/red stripes, EN = simplified Union-Jack-ish layered gradients),
  native name, English label, checkmark on active.
- Selecting an option calls `applyLang(code)`:
  - Iterates `[data-i18n]` elements → sets `textContent` from dictionary.
  - Iterates `[data-i18n-html]` elements → sets `innerHTML` (used where the
    translated string contains markup, e.g. headings with serif accents).
  - Updates `<html lang>` and the button label.
- Persist via `localStorage["miia.lang"]`. On first visit, read
  `navigator.language` (`uk-*` → uk, `pl-*` → pl, else en).
- The complete translation dictionary (English / Ukrainian / Polish) is in the
  `<script>` block at the end of the file under `const I18N = { en, uk, pl }`.
  **Lift this dictionary verbatim** — the Polish and Ukrainian copy has been
  reviewed; don't machine-retranslate.

### Hero Chat Animation

- Messages fade in with staggered delays (.2s, 1.2s, 2.4s, 3.4s) via the `msgIn`
  keyframe.
- Typing dots: 3 spans with `typing` keyframe, .15s and .3s staggered delays.
- Orbs gently float on 9s and 11s loops.
- Eyebrow dot pulses (`pulse` keyframe, 2.4s).
- Voice waveform bars use a 1.3s `wave` keyframe with 0.08s per-bar stagger.
- Doc-search cursor blinks (1s steps(2)).

### Hover States

- Primary button: `translateY(-2px)` + stronger shadow + a faint highlight overlay
  fading in via `::before`.
- Ghost button: blue-soft background, blue border.
- Capability card: `translateY(-3px)` + stronger border.
- Footer link `↗`: amber color + slight translate up-right.
- Nav links + theme/lang buttons: text color brightens.

### Accessibility Notes

- Theme toggle has `aria-label="Toggle theme"`.
- Lang button has `aria-haspopup="true"` + `aria-expanded` that flips with state.
- All decorative SVGs should have `aria-hidden="true"` in production.
- Color contrast in both themes meets WCAG AA for body text. Verify the gradient
  primary button's text contrast in your environment (it uses fixed dark text on
  the light gradient).

## CTA Links — Replace These

Every "Open in Telegram" link points to `https://t.me/` as a placeholder.
**Replace with the real bot deep link**, e.g. `https://t.me/YourMiiaBotName`.

Footer links (Help center, Contact us, Telegram channel, Discussion group,
Changelog, Roadmap, Privacy, Terms, Data & security) are all `href="#"` — wire
to real destinations.

## State Management

Minimal. Two persisted UI states only:

- `theme`: `"dark" | "light"` — applied as `<html data-theme>` attribute.
- `lang`: `"en" | "uk" | "pl"` — drives the i18n string lookup.

Both should hydrate from localStorage on mount with the fallbacks described above.

If you build in Next.js, consider SSR-ing both from a cookie to avoid flash of
wrong theme/language.

## Assets

- `design/assets/miia-logo.jpg` — the source logo (1024×1024-ish JPEG). For
  production, request a **transparent PNG or SVG** version from the brand owner
  for the nav avatar and any place the logo sits on non-navy backgrounds. The
  current JPEG has a navy background baked in, which looks fine on dark theme
  but slightly contrasts in light theme.

No icon library is used — all icons are inline SVG drawn in the markup. You can
replace these with a library like Lucide / Heroicons if your codebase already
ships one.

## Files

- `design/Miia Site.html` — the complete prototype, self-contained except for
  Google Fonts and the logo JPEG. Open in any browser to interact with it.
- `design/assets/miia-logo.jpg` — the logo asset.

The HTML file is structured as one CSS block, one HTML body, one inline JS block
at the end (i18n dictionary + theme/lang wiring). Extract these into the target
codebase's conventions:

- CSS custom properties → your design tokens system
- The 7 capability cards → 7 components or one data-driven component
- The translation dictionary → your i18n message catalog (one file per locale)
- The theme + lang controllers → small client-side hooks/contexts
