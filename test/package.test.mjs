import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { buildPreview, previewPath, sourcePath } from '../scripts/build-preview.mjs';

describe('media/preview.svg', () => {
  it('is up to date with mouse-scroll-cue.svg (run `npm run build:preview`)', () => {
    const expected = buildPreview(readFileSync(sourcePath, 'utf8'));
    assert.equal(readFileSync(previewPath, 'utf8'), expected);
  });
});

describe('npm package', () => {
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' }),
  );
  const files = pack.files.map((file) => file.path).sort();

  it('ships exactly the SVG, both licenses, the attribution notice and the README', () => {
    assert.deepEqual(files, [
      'LICENSE-CC-BY-4.0',
      'LICENSE-MIT',
      'NOTICE.md',
      'README.md',
      'mouse-scroll-cue.svg',
      'package.json',
    ]);
  });
});
