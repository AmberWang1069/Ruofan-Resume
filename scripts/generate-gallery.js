#!/usr/bin/env node
// generate-gallery.js (cleaned)
// Scans the images/ folder and regenerates the conveyor gallery markup
// Usage: node scripts/generate-gallery.js

const fs = require('fs').promises;
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const GALLERY_PAGE = path.join(ROOT, 'grid-gallery.html');

const START_MARKER = '<!-- GALLERY-AUTO-START: DO NOT EDIT BETWEEN THESE MARKERS (generated) -->';
const END_MARKER = '<!-- GALLERY-AUTO-END -->';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

// --- helpers ---
async function readImages() {
  try {
    const files = await fs.readdir(IMAGES_DIR);
    return files
      .filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
      .sort();
  } catch (e) {
    console.error('Failed to read images directory:', e.message);
    return [];
  }
}

// Build many items to avoid gaps on very wide screens and to allow seamless looping.
// Also duplicate the sequence twice inside each belt so CSS keyframe looping is smooth.
function buildBeltImgsHtml(list) {
  if (!list.length) return '';
  const minTotal = 16; // heuristic to reduce gaps on ultra-wide layouts
  const repeats = Math.max(2, Math.ceil(minTotal / list.length));
  const expanded = [];
  for (let i = 0; i < repeats; i++) expanded.push(...list);

  // Duplicate the expanded run twice for seamless infinite animation
  const doubled = expanded.concat(expanded);

  return doubled
    .map(fn => {
      const base = path.basename(fn, path.extname(fn));
      return `            <img src="images/${fn}" alt="${base}" class="belt-img">`;
    })
    .join('\n');
}

// Put this helper near the top with the other helpers
function rotate(arr, n) {
  if (!arr.length) return arr;
  const k = ((n % arr.length) + arr.length) % arr.length; // safe mod
  return arr.slice(k).concat(arr.slice(0, k));
}

// We keep the SAME ordering on both belts; direction is handled by CSS keyframes.
// The “train” effect comes from giving the bottom belt a phase offset (delay)
// so that when a photo exits the top-right, it later appears entering the bottom-right.
function buildGalleryHtml(imgList) {
  if (!imgList.length) return '            <p>No images found in images/</p>';

  // Start bottom belt from the 5th image (change to 4 if you want)
  const BOTTOM_OFFSET = Math.min(5, Math.max(0, imgList.length - 1));
  const topHtml = buildBeltImgsHtml(imgList);
  const bottomHtml = buildBeltImgsHtml(rotate(imgList, BOTTOM_OFFSET));

  return [
    `            <div class="conveyor-gallery">`,
    `              <!-- Top belt: left → right -->`,
    `              <div class="conveyor conveyor-top" aria-hidden="false">`,
    `                <div class="belt belt-right">`,
    `${topHtml}`,
    `                </div>`,
    `              </div>`,
    ``,
    `              <!-- Bottom belt: right → left, starts from image #${BOTTOM_OFFSET + 1} -->`,
    `              <div class="conveyor conveyor-bottom" aria-hidden="false">`,
    `                <div class="belt belt-left">`,
    `${bottomHtml}`,
    `                </div>`,
    `              </div>`,
    `            </div>`
  ].join('\n');
}

async function regenerate() {
  const imgs = await readImages();
  const galleryHtml = buildGalleryHtml(imgs);

  let page = await fs.readFile(GALLERY_PAGE, 'utf8');
  const startIdx = page.indexOf(START_MARKER);
  const endIdx = page.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found in grid-gallery.html. Please ensure the file contains the start and end markers.');
    process.exit(1);
  }

  const before = page.slice(0, startIdx + START_MARKER.length);
  const after = page.slice(endIdx);

  const newContent = before + '\n' + galleryHtml + '\n' + after;
  await fs.writeFile(GALLERY_PAGE, newContent, 'utf8');
  console.log(`Regenerated gallery with ${imgs.length} image(s). Updated ${GALLERY_PAGE}`);
}

regenerate().catch(err => {
  console.error(err);
  process.exit(1);
});
