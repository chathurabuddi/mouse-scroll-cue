# AGENTS.md

Guidance for AI agents and humans working in this repository.
Read this before making changes.

## What this is

A single animated SVG, `mouse-scroll-cue.svg`, that implements Airat's [Mouse scroll tooltip Microinteraction](https://www.figma.com/community/file/1255139674516193870/mouse-scroll-tooltip-microinteraction) design from Figma Community.
It ships to npm and to GitHub Pages as a demo.
There is no build step for the SVG itself.

## Hard rules

1. **Keep the attribution.** The comment block at the top of the SVG carries the CC BY 4.0 credit into every copy of the file.
   Never remove or shorten it.
   Tests check each required part.
2. **Stay faithful to the design.** Changes to how the cue looks or moves need an issue first, and a line in `NOTICE.md` under "Changes".
3. **Prefix everything.** Every class, id and keyframes name in the SVG starts with `mouse-scroll-cue-`, so inlining it cannot clash with a host page.
   Tests enforce this.
4. **Respect reduced motion.** The `prefers-reduced-motion: reduce` rule must stop every animation.
5. **Never hand-edit generated files.** `media/preview.svg` comes from `npm run build:preview`.
   `CHANGELOG.md` comes from release-please.

## Layout

```
mouse-scroll-cue.svg       the product (CC BY 4.0)
index.html                 demo page, deployed to GitHub Pages
media/preview.svg          README preview on a dark tile (generated)
scripts/build-preview.mjs  builds media/preview.svg from the SVG
test/                      node:test suites
NOTICE.md                  attribution, changes and license map
```

## The animation

The Figma prototype waits 1ms, runs Smart Animate on a spring (stiffness 23.33, mass 1) for 2315ms, waits 1ms, then snaps back.
That is one 2317ms CSS loop.
The spring is sampled into a `linear()` easing, and a `cubic-bezier()` declaration comes first as the fallback for browsers without `linear()`.
`test/mouse-scroll-cue.test.mjs` checks that the `linear()` stops follow the spring within 0.0015 across the whole loop, so retune the stops and the test together.

## Commands

```bash
npm ci                 # install
npm test               # node:test suites
npm run format         # prettier --write
npm run build:preview  # regenerate media/preview.svg after editing the SVG
npm run check          # format check + tests, run before pushing
```

## Writing style

Markdown puts each sentence on its own line.
Use straight quotes and plain hyphens, never curly quotes or em dashes.
The license texts are verbatim copies and are exempt.
