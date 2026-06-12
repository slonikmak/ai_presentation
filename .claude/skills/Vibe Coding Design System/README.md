# Vibe Coding — Design System

A design system for **Vibe Coding**, an internal, team-facing presentation site about the
capabilities of **AI in software development and process automation**. The audience is a
single engineering team — peers, not the public — so the voice is direct and technical, and
the visual language is **clean, light, and confident**: an instrument that gets out of the way.

Visual reference given by the requester: **esprow.com** — a clean, editorial B2B fintech
aesthetic. This system adopts its core DNA — a **light, airy** canvas, a vivid
**raspberry-magenta** signature accent, **slate** neutrals, **square (sharp) corners**, the
recurring **`/` slash** (as logo device and large diagonal motif), **two-part headlines** that
mix a light lead clause with a bold/colored turn, and esprow's signature **solid color-block
panel row** — but executes it **more modern and more concise**: one disciplined accent, a
contemporary humanist grotesque, generous whitespace, and less visual noise.

> **Note on origin:** No codebase, Figma file, or brand assets were supplied — only the brief
> and the esprow.com reference screenshots. Fonts are Google Fonts substitutions (see below)
> and the logo is an original typographic wordmark. Swap in real brand assets whenever they
> exist.

---

## Index — what's in this folder

| Path | What it is |
|---|---|
| `README.md` | This file — context, content & visual foundations, iconography. |
| `colors_and_type.css` | Source of truth for color + type tokens (CSS custom properties + semantic type classes). Import this everywhere. |
| `SKILL.md` | Agent-Skill manifest so this system can be used inside Claude Code. |
| `assets/` | Logo lockups, favicon, reusable brand graphics. |
| `fonts/` | (Fonts are loaded from Google Fonts CDN in `colors_and_type.css` — see Font note.) |
| `preview/` | Small HTML cards that populate the Design System tab (tokens, specimens, components). |
| `ui_kits/website/` | High-fidelity recreation of the Vibe Coding presentation **website** — components + interactive `index.html`. |

*(No slide-deck template was provided and the medium is a presentation website, so there is
no `slides/` folder. The website UI kit is the presentation surface.)*

---

## Brand at a glance

- **Name:** Vibe Coding (internal initiative) — wordmark **`/VIBE CODING`**
- **One-liner:** *Ship faster with AI in the loop — from first prompt to merged PR.*
- **Signature accent:** raspberry-magenta `#E6006B`
- **Neutrals:** slate `#3D4757` / slate-deep `#2B3340` on a white / `#F4F5F7` canvas
- **Type:** Hanken Grotesk (display/UI/body) + JetBrains Mono (code only)
- **Corners:** sharp — 0–4px max, never pill
- **Motif:** the forward slash `/` — logo device, eyebrow prefix, and large diagonal
  translucent parallelograms across hero/card corners.

---

## CONTENT FUNDAMENTALS

How copy is written across the site and slides.

**Voice.** Peer-to-peer engineer talk. We're presenting to our own team, so we skip the
marketing gloss and get to the point. Confident, specific, never hype-y. Think a sharp
internal RFC or a great conference talk by someone on your team — not a sales page.

**Person.** Mostly **"we"** (the team, collectively) and **imperative "you"** for actions
("Drop your repo in, get a review in 30 seconds"). Avoid "users" — say "we" or "the team."

**Casing.** Headlines and section titles in **sentence case** ("Let AI handle the boilerplate"),
*not* Title Case. Eyebrows/labels in **UPPERCASE sans** (Hanken Grotesk 700) with wide
tracking, often prefixed with the magenta slash ("`/ WHAT CHANGED`"). **Buttons are UPPERCASE**
(esprow style), short and verb-led.

**Tone & rhythm.** Short, declarative sentences. Lead with the verb or the outcome. Numbers
are concrete ("cut review time 40%", "12 repos, one pipeline"). Two-part editorial headlines
borrowed from the reference — a statement, then a turn:

> *High-touch craft.* **Low-touch toil.**
> *You write the intent.* **AI writes the boilerplate.**

**Technical vocabulary is welcome.** PR, CI, diff, prompt, agent, pipeline, merge, lint — the
audience speaks it. Don't over-explain. Inline code formatting (`git rebase`, `--dry-run`) is
encouraged and on-brand.

**Emoji:** none. Not part of the brand. Use the icon set or the slash motif instead.

**Punctuation flourish:** the slash. Use it as a separator in eyebrows and metadata
(`AUTOMATION / PR REVIEW / 2026`), as the logo device (`/VIBE`), and as a numbered marker on
color blocks (`/01`, `/02`). It's the brand's comma.

**Examples**
- Eyebrow: `/ WHAT CHANGED`
- Headline: `From "write it all" to "review it all"`
- Lead: `AI now drafts the first 80%. We spend our time on the 20% that's actually hard.`
- CTA: `See the workflow` · `Run the demo` · `Open the playbook`
- Stat label: `MERGED PRs / WK` → `218`

---

## VISUAL FOUNDATIONS

**Overall vibe.** Light, airy, architectural. Big whitespace, sharp square corners, and one
disciplined accent. Confident editorial typography over a mostly-white canvas, punctuated by
solid slate and magenta panels. It should feel like a precise, modern B2B product page — calm
until the magenta does the talking.

**Color.** A **white / `#F4F5F7`** canvas (`--bg`, `--bg-soft`, `--bg-tint`). **Slate** is the
neutral-dark workhorse — `--slate-deep #2B3340` for headlines and deep panels, `--slate
#3D4757` for nav/dark panels/UI, `--slate-soft #5C6675` for body, `--slate-mut` for captions.
A single **raspberry-magenta** `--accent #E6006B` carries emphasis: primary buttons, eyebrows,
active states, the slash, key data, top-rules. `--blue #1F7FD6` is the inline-link / info
color; `--teal` and `--amber` appear rarely for data. Rule of thumb: one accent per view;
magenta wins ties. Most of any screen is white + slate.

**Type.** Two families. **Hanken Grotesk** for everything visible — its wide weight range
powers the **two-part headline**: a *light* (300) lead clause + a *bold* (800), often magenta,
turn ("You write the intent. **AI writes the boilerplate.**"). Eyebrows/labels are **uppercase
sans** (700, tracked). **JetBrains Mono** is reserved for **code and terminal output only**
(the AI-in-dev subject) plus the occasional metadata line — not for eyebrows. No third family.

**Spacing.** 8pt system (`--s-1`=4 → `--s-10`=128). Sections breathe: `--s-9`/`--s-10` between
bands. Cards/panels use `--s-5`/`--s-6` internal padding.

**Backgrounds.** Flat fills, never gradients. White is the default; `--bg-soft` bands separate
sections (workflow, footer); **solid slate / magenta panels** carry the esprow-style
color-block row. Texture comes only from the **slash motif** — large translucent diagonal
parallelograms (`skewX(-20deg)`, `--slash-fill` over dark, `--slash-fill-dark` over light) in
hero and card corners. No photographic backgrounds by default; if imagery is wanted, drop a
real screenshot/photo into an image slot (no generated art).

**Borders & cards.** Two card styles: (1) **solid panels** — slate or magenta fill, white
text, a slash in the corner, an uppercase CTA (esprow product-card style); (2) **white cards**
— `#fff` with a `--line-1` hairline and a **3px magenta top-rule**, `--shadow-sm` at rest. All
corners square (`--r-xs` 2px max). Elevation is subtle: `--shadow-sm` cards, `--shadow-md` on
hover, `--shadow-lg` for the dark terminal/overlay panels only.

**Corner radii.** Sharp & architectural: `0 / 2 / 3 / 4`. Buttons and cards use `--r-xs`
(2px). **Never** pills, never large radii. This squareness is core to the esprow lineage.

**Hover states.** Primary buttons darken (`--accent → --accent-deep`); slate buttons darken to
`--slate-deep`; ghost buttons fill magenta. White cards lift (`--shadow-sm → --shadow-md`);
nav links gain a magenta underline; footer/social links turn magenta. Quick
(`--dur-fast`/`--dur`) on `--ease-out`.

**Press states.** Subtle scale-down (`scale(0.98)`). No bounce.

**Animation.** Restrained, functional. Entrance = a short **translateY rise** (16px) on
`--ease-out`, staggered for grids — *transform-only, never opacity*, so content is always
visible if the animation doesn't run (print, hidden tabs, reduced motion). Signature touch: a
**blinking magenta caret** + **type-on** effect in terminal/code panels. No looping decorative
motion. Gate entrance animations behind a JS `data-animate` flag set only when the document is
visible.

**Transparency & blur.** Minimal. The sticky header is solid white with a hairline + soft
shadow on scroll (no glass). Keep content crisp; reserve translucency for the slash motif.

**Imagery treatment.** Optional. If used, prefer real product screenshots over stock; frame in
a white card with a hairline, cool-toned and high-contrast. Provide via image slots — never
generated.

**Layout rules.** Max content width ~1240px, centered, 40px gutters; the slash motif and
color-block row may bleed full-width. Sticky top nav. Left-aligned editorial text (no centered
paragraphs). Generous vertical rhythm between bands.

---

## ICONOGRAPHY

No proprietary icon set existed, so the system standardizes on **Lucide**
(https://lucide.dev) — an open, modern, consistent **stroke** icon family that matches the
technical/IDE aesthetic. *(Substitution flagged: swap for a house set if one is adopted.)*

**How to load** (CDN, no build step):
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="terminal"></i>
<script>lucide.createIcons();</script>
```
In React/JSX prototypes, render inline SVGs in the Lucide style (1.75–2px stroke,
`currentColor`) or use the CDN script after mount.

**Style rules**
- **Stroke only**, never filled. Stroke width **1.75px** at 20–24px sizes; **2px** at small
  sizes. `stroke: currentColor` so icons inherit text color (default `--slate` / `--slate-soft`;
  `#fff` on slate/magenta panels; `--accent` for active/interactive).
- **Sizes:** 16 (inline w/ small text), 20 (default UI), 24 (buttons, nav), 32+ (feature
  cards). Keep stroke proportional.
- **Optical alignment:** icons sit on the text baseline in buttons with `--s-2` gap.
- **Don't** mix icon families, don't recolor with gradients, don't add drop shadows.

**Common icons in this system:** `terminal`, `git-pull-request`, `git-merge`, `git-branch`,
`bot`, `sparkles`, `zap`, `workflow`, `code`, `play`, `arrow-right`, `check`,
`circle-check`, `alert-triangle`, `cpu`, `package`, `clock`, `chevron-right`.

**The slash `/`** is the brand's own pseudo-icon — logo device, eyebrow prefix, and large
diagonal parallelogram. It is typographic (Hanken Grotesk 800, magenta) or a CSS shape, not an
SVG icon.

**Emoji:** never. **Unicode glyphs:** only the slash `/`, the arrow `→`, and the terminal
caret `▍` are used as typographic marks — no other unicode-as-icon.

