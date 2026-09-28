# Notice

Mouse Scroll Cue implements a design made by someone else.
This file records who made what, what changed, and which license covers each part.

## Original design

- **Title:** Mouse scroll tooltip Microinteraction
- **Designer:** Airat, [figma.com/@airatdesign](https://www.figma.com/@airatdesign)
- **Source:** [Figma Community file 1255139674516193870](https://www.figma.com/community/file/1255139674516193870/mouse-scroll-tooltip-microinteraction)
- **License:** [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/), as stated on the Figma Community page when checked on 2026-09-28.

All credit for the look and the motion of the design goes to Airat.

## Changes made in this implementation

- Rebuilt the Figma prototype as a single standalone SVG file.
- Recreated the prototype's Smart Animate spring as a looping CSS animation, using `linear()` easing sampled from the spring, with a `cubic-bezier()` fallback.
- Added a `prefers-reduced-motion` rule that stops the animation.
- Prefixed every class, id and keyframes name with `mouse-scroll-cue-`, so the markup can be inlined into any page.

## Licenses in this repository

| Files                                       | License                                                                                                                                                     | Copyright                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `mouse-scroll-cue.svg`, `media/preview.svg` | CC BY 4.0, see [LICENSE-CC-BY-4.0](LICENSE-CC-BY-4.0)                                                                                                       | Airat (original design), Chathura Buddhika (SVG implementation) |
| `CODE_OF_CONDUCT.md`                        | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), adapted from [Contributor Covenant 3.0](https://www.contributor-covenant.org/version/3/0/) | Organization for Ethical Source                                 |
| `LICENSE-CC-BY-4.0`                         | The license text itself, see [Creative Commons](https://creativecommons.org/licenses/by/4.0/legalcode.en)                                                   | Creative Commons                                                |
| Everything else                             | MIT, see [LICENSE-MIT](LICENSE-MIT)                                                                                                                         | Chathura Buddhika                                               |

## Giving credit when you use the SVG

CC BY 4.0 requires credit whenever you share the SVG, as is or modified.
The comment block at the top of `mouse-scroll-cue.svg` already carries that credit, so keep it in every copy.
Where your project lists credits (an about page, a README, a colophon), a line like this works well:

> Scroll cue: [Mouse Scroll Cue](https://github.com/chathurabuddi/mouse-scroll-cue) by Chathura Buddhika, based on [Mouse scroll tooltip Microinteraction](https://www.figma.com/community/file/1255139674516193870/mouse-scroll-tooltip-microinteraction) by [Airat](https://www.figma.com/@airatdesign), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

If you change the SVG, say so in the comment block, for example by adding a line under `Changes:`.

This notice explains how the project applies the license.
It is not legal advice, and the license text is what counts.
