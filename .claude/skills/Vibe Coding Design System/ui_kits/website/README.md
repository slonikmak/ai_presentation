# Vibe Coding — Website UI Kit

A high-fidelity, interactive recreation of the **Vibe Coding** internal presentation site —
the team-facing page about AI in software development & process automation. Light, editorial,
esprow-inspired; built on the shared foundations in `../../colors_and_type.css`.

> This is an *original* design authored against the brief and the esprow.com reference. It is
> a UI kit — cosmetic, modular components, not production code.

## Run it
Open `index.html`. It's a React + Babel single page. Icons come from **Lucide** (CDN);
fonts (Hanken Grotesk + JetBrains Mono) load from Google Fonts via the shared CSS.

## What's interactive
- **Nav** — sticky white header; magenta underline on the active link; "Run the demo"
  smooth-scrolls to the workflow.
- **Hero** — slash-motif backdrop + auto-typing slate terminal panel.
- **Color blocks** — esprow's signature solid-panel row (magenta / slate / slate-deep / light
  CTA).
- **Capabilities** — three esprow-style product cards (slate/magenta, slash, uppercase CTA) +
  a white-card grid with magenta top-rules.
- **Workflow** — click any of the 4 steps to swap the dark panel (prompt → diff → review →
  PR); "Run the demo" auto-advances the pipeline.
- **Footer** — newsletter + social utility strip and 4 underlined link columns.

## Components
| File | Component | Notes |
|---|---|---|
| `Icon.jsx` | `Icon`, `Logo`, `Button` | Lucide wrapper; `/VIBE CODING` wordmark; square uppercase buttons (primary / slate / ghost / link). |
| `Nav.jsx` | `Nav` | Sticky white header. |
| `Hero.jsx` | `Hero`, `Terminal` | Two-part headline + slash motif + live terminal. |
| `ColorBlocks.jsx` | `ColorBlocks` | esprow-style solid color-panel row. |
| `Capabilities.jsx` | `Capabilities`, `ProductCard`, `CapCard` | Product cards + capability grid. |
| `Workflow.jsx` | `Workflow`, `WorkflowPanel` | Interactive 4-step pipeline. |
| `Metrics.jsx` | `Metrics` | 4-up stat band. |
| `Footer.jsx` | `Footer` | Utility strip + link columns. |

## Conventions
- Components export to `window` (Babel scripts don't share scope).
- No `styles` object collisions — styles are inline or uniquely scoped.
- Entrance animations are **transform-only** (no opacity) and gated behind a `data-animate`
  body attribute set only when the document is visible — so print / screenshots / hidden tabs
  always show content.

## Notes / gaps
- "Playbook" nav link and footer links are non-functional placeholders (single-page kit).
- Imagery is intentionally absent — the design is screenshot/photo-free by default. Drop real
  product shots into a white card frame if needed.
