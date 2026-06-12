---
name: vibe-coding-design
description: Use this skill to generate well-branded interfaces and assets for Vibe Coding (an internal AI-in-development & process-automation initiative), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

This is a light, editorial, esprow-inspired brand: a white / `#F4F5F7` canvas, a vivid
raspberry-magenta signature accent (#E6006B), slate neutrals (#2B3340 / #3D4757), Hanken
Grotesk + JetBrains Mono type, square (sharp) corners, and a forward-slash "/" motif. Tone is
direct, peer-to-peer engineer talk — sentence-case headlines (light lead clause + bold/magenta
turn), UPPERCASE sans eyebrows and buttons, no emoji.

Key files:
- `README.md` — context, Content Fundamentals, Visual Foundations, Iconography.
- `colors_and_type.css` — import this for all color + type tokens (CSS custom properties +
  semantic type classes like `.t-display`, `.t-kicker`, `.t-label`, `.t-mono`).
- `assets/mark.svg` — the slash logo mark.
- `ui_kits/website/` — React/Babel component recreations (Nav, Hero, ColorBlocks, product
  cards, workflow, footer).
- `preview/` — token & component reference cards.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view. If working on production code, copy assets and
read the rules here to become an expert in designing with this brand.

Icons: use Lucide (https://lucide.dev), stroke-only, 1.75–2px, currentColor.

If the user invokes this skill without any other guidance, ask them what they want to build or
design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.
