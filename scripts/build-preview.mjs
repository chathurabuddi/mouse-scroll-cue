import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const sourcePath = fileURLToPath(new URL('../mouse-scroll-cue.svg', import.meta.url));
export const previewPath = fileURLToPath(new URL('../media/preview.svg', import.meta.url));

const TILE = 160;
const TILE_COLOR = '#161616';
const ICON_WIDTH = 92;
const ICON_HEIGHT = 106;

export function buildPreview(source) {
  const root = `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_WIDTH}" height="${ICON_HEIGHT}"`;
  if (!source.startsWith(root)) {
    throw new Error(`Expected mouse-scroll-cue.svg to start with: ${root}`);
  }
  const x = (TILE - ICON_WIDTH) / 2;
  const y = (TILE - ICON_HEIGHT) / 2;
  const icon = source
    .trimEnd()
    .replace(root, `<svg x="${x}" y="${y}" width="${ICON_WIDTH}" height="${ICON_HEIGHT}"`)
    .replaceAll('\n', '\n  ');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}" viewBox="0 0 ${TILE} ${TILE}" fill="none">`,
    '  <!-- Generated from mouse-scroll-cue.svg by scripts/build-preview.mjs (npm run build:preview). Do not edit. -->',
    `  <rect width="${TILE}" height="${TILE}" rx="24" fill="${TILE_COLOR}"/>`,
    `  ${icon}`,
    '</svg>',
    '',
  ].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(previewPath, buildPreview(readFileSync(sourcePath, 'utf8')));
  console.log(`Wrote ${previewPath}`);
}
