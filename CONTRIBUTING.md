# Contributing

Thanks for helping improve Mouse Scroll Cue.
Please also read [AGENTS.md](AGENTS.md) for the project layout and its hard rules, and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## What fits this project

This project implements [Airat's design](https://www.figma.com/community/file/1255139674516193870/mouse-scroll-tooltip-microinteraction) as faithfully as possible.

- **Always welcome:** bug fixes, browser compatibility fixes, accessibility improvements, smaller output, and better docs.
- **Discuss first:** anything that changes how the cue looks or moves.
  Open an issue before writing code, so we can agree it still honours the original design.

## Development setup

You need Node.js 24 or later.

```bash
git clone https://github.com/chathurabuddi/mouse-scroll-cue.git
cd mouse-scroll-cue
npm ci
```

Open `index.html` in a browser to see the demo page with your changes.

## Before you open a pull request

Run the same checks CI runs:

```bash
npm run check
```

That runs Prettier in check mode and the `node:test` suites.
If you edited `mouse-scroll-cue.svg`, also run `npm run build:preview` and commit the regenerated `media/preview.svg`.
CI fails if the preview is stale.

### The things CI rejects

1. **A missing or shortened attribution comment.** The comment at the top of the SVG is how every copy credits Airat, as CC BY 4.0 requires.
2. **Unprefixed names.** Every class, id and keyframes name in the SVG must start with `mouse-scroll-cue-`.
3. **Easing drift.** The `linear()` stops must stay within 0.0015 of the spring the prototype uses.
4. **A lost reduced-motion rule.** `prefers-reduced-motion: reduce` must stop every animation.
5. **Unexpected package contents.** The npm package ships only the SVG, its two licenses, `NOTICE.md` and the README.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/), such as `fix:`, `feat:`, `docs:` or `chore:`.
The commit type decides the next version and becomes the changelog entry, so choose it with care.
Do not edit `CHANGELOG.md` by hand.

## Licensing of contributions

By contributing, you agree that your changes to `mouse-scroll-cue.svg` are licensed under CC BY 4.0, and everything else under MIT, matching the rest of the repository.
See [NOTICE.md](NOTICE.md) for the details.

## Releasing (maintainers)

Releases are automated with [release-please](https://github.com/googleapis/release-please).

1. Merging to `main` makes release-please open or update a release pull request with the next version and the generated changelog.
2. Merging that release pull request tags the release, creates the GitHub release, and publishes to npm through [trusted publishing](https://docs.npmjs.com/trusted-publishers), with provenance.
3. jsDelivr picks up the new npm version on its own.

Release pull requests are opened with the default `GITHUB_TOKEN`, so CI does not run on them.
The publish job runs the full test suite before it publishes.

### First release (one time)

Version 1.0.0 is released by hand, because npm sets up a trusted publisher from the package's settings page, which only exists after the first publish.
Do these steps in this order.
The `v1.0.0` GitHub release must exist before `main` is first pushed, or release-please treats every earlier commit as unreleased and opens a release pull request for them.

1. Create the empty GitHub repository, without pushing `main`.
2. In **Settings > Actions > General**, turn on **Allow GitHub Actions to create and approve pull requests**, so release-please can open its pull requests later.
3. In **Settings > Pages**, set **Source** to **GitHub Actions**, so the demo can deploy.
4. In **Settings > Security**, turn on **Private vulnerability reporting**, which [SECURITY.md](SECURITY.md) relies on.
5. Tag the release commit and push only the tag: `git tag v1.0.0 && git push origin v1.0.0`.
6. Create the GitHub release from it: `gh release create v1.0.0 --verify-tag --title v1.0.0 --notes "Initial release."`.
7. Push `main`: `git push -u origin main`.
   CI and the demo deploy run.
   Release-please should find `v1.0.0` and do nothing, so close any release pull request it opens anyway.
8. From a clean checkout of `v1.0.0`, run `npm publish`.
9. On npmjs.com, open the package settings and add a **Trusted Publisher**: GitHub Actions, user `chathurabuddi`, repository `mouse-scroll-cue`, workflow `release.yml`, with direct `npm publish` allowed.

Every later release goes through release-please and publishes from CI.
