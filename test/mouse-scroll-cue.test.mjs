import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { XMLValidator } from 'fast-xml-parser';

const svg = readFileSync(new URL('../mouse-scroll-cue.svg', import.meta.url), 'utf8');
const style = svg.match(/<style>([\s\S]*?)<\/style>/)[1];
const PREFIX = 'mouse-scroll-cue-';

// The Figma prototype: 1ms delay, a 2315ms spring (stiffness 23.33, mass 1), 1ms hold.
const DELAY_MS = 1;
const SPRING_MS = 2315;
const LOOP_MS = DELAY_MS + SPRING_MS + 1;
const OMEGA = Math.sqrt(23.33 / 1);

function spring(progress) {
  const seconds = (progress * LOOP_MS - DELAY_MS) / 1000;
  if (seconds <= 0) return 0;
  if (seconds >= SPRING_MS / 1000) return 1;
  return 1 - (1 + OMEGA * seconds) * Math.exp(-OMEGA * seconds);
}

function linearStops() {
  const args = style.match(/animation-timing-function:\s*linear\(([^)]*)\)/)[1];
  const stops = args.split(',').map((stop) => stop.trim().split(/\s+/));
  return stops.map(([output, input], index) => ({
    output: Number(output),
    input: input === undefined ? index / (stops.length - 1) : parseFloat(input) / 100,
  }));
}

function sampleLinear(stops, progress) {
  const next = stops.findIndex((stop) => stop.input >= progress);
  if (next <= 0) return stops.at(next).output;
  const prev = stops[next - 1];
  const span = stops[next].input - prev.input;
  return prev.output + ((stops[next].output - prev.output) * (progress - prev.input)) / span;
}

describe('mouse-scroll-cue.svg', () => {
  it('is well-formed XML', () => {
    assert.equal(XMLValidator.validate(svg), true);
  });

  it('keeps the 92 x 106 frame', () => {
    assert.match(svg, /<svg [^>]*width="92" height="106" viewBox="0 0 92 106"/);
  });

  describe('attribution (CC BY 4.0, section 3(a)(1))', () => {
    const header = svg.match(/<!--([\s\S]*?)-->/)[1];

    for (const [what, text] of [
      ['credits the designer', 'Airat (https://www.figma.com/@airatdesign)'],
      [
        'links the original design',
        'https://www.figma.com/community/file/1255139674516193870/mouse-scroll-tooltip-microinteraction',
      ],
      ['names the license', 'SPDX-License-Identifier: CC-BY-4.0'],
      ['links the license', 'https://creativecommons.org/licenses/by/4.0/'],
      ['states the changes', 'Changes:'],
      ['refers to the warranty disclaimer', 'without warranties'],
      ['links the project', 'https://github.com/chathurabuddi/mouse-scroll-cue'],
    ]) {
      it(what, () => assert.ok(header.includes(text), `missing "${text}"`));
    }

    it('sits inside the <svg> element, so inlining the markup keeps it', () => {
      assert.ok(svg.indexOf('<!--') > svg.indexOf('<svg'));
    });
  });

  describe('safe to inline into any page', () => {
    it('prefixes every class', () => {
      const classes = [...svg.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
      assert.ok(classes.length > 0);
      for (const name of classes) assert.ok(name.startsWith(PREFIX), name);
    });

    it('prefixes every id', () => {
      const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
      assert.ok(ids.length > 0);
      for (const id of ids) assert.ok(id.startsWith(PREFIX), id);
    });

    it('prefixes every CSS class selector and keyframes name', () => {
      const css = style.replace(/\/\*[\s\S]*?\*\//g, '');
      const selectors = [...css.matchAll(/\.([a-z][\w-]*)/g)].map((m) => m[1]);
      const keyframes = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]);
      assert.ok(selectors.length > 0 && keyframes.length > 0);
      for (const name of [...selectors, ...keyframes]) assert.ok(name.startsWith(PREFIX), name);
    });
  });

  describe('animation', () => {
    it(`loops every ${LOOP_MS}ms`, () => {
      assert.match(style, new RegExp(`animation: ${LOOP_MS}ms infinite;`));
    });

    it('declares a cubic-bezier() fallback before linear()', () => {
      const fallback = style.indexOf('animation-timing-function: cubic-bezier(');
      const linear = style.indexOf('animation-timing-function: linear(');
      assert.ok(fallback !== -1 && fallback < linear);
    });

    it('uses linear() stops that rise from 0 to 1 in order', () => {
      const stops = linearStops();
      assert.equal(stops[0].output, 0);
      assert.equal(stops.at(-1).output, 1);
      for (let i = 1; i < stops.length; i++) {
        assert.ok(stops[i].input >= stops[i - 1].input, `input order at stop ${i}`);
        assert.ok(stops[i].output >= stops[i - 1].output, `output order at stop ${i}`);
      }
    });

    it('follows the Figma spring within 0.0015 across the whole loop', () => {
      const stops = linearStops();
      for (let i = 0; i <= 10_000; i++) {
        const progress = i / 10_000;
        const error = Math.abs(sampleLinear(stops, progress) - spring(progress));
        assert.ok(error < 0.0015, `off by ${error.toFixed(5)} at ${(progress * 100).toFixed(2)}%`);
      }
    });

    it('stops for prefers-reduced-motion', () => {
      const block = style.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?\})\s*\}/);
      assert.ok(block, 'missing reduced-motion media query');
      assert.match(block[1], /animation: none;/);
      for (const selector of [`.${PREFIX}dot`, `.${PREFIX}arrow`]) {
        assert.ok(block[1].includes(selector), selector);
      }
    });
  });
});
