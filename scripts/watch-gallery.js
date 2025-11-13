#!/usr/bin/env node
// watch-gallery.js
// Watches the images/ directory and runs scripts/generate-gallery.js on changes

const path = require('path');
const { exec } = require('child_process');
const chokidar = require('chokidar');

const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
// Use the canonical generator script
const GENERATOR = path.join(ROOT, 'scripts', 'generate-gallery.js');

let timer = null;
function runGenerator() {
  if (timer) clearTimeout(timer);
  // debounce: wait 150ms of quiet before running
  timer = setTimeout(() => {
    console.log('[watch-gallery] Change detected — regenerating gallery...');
    const child = exec(`node "${GENERATOR}"`, { cwd: ROOT }, (err, stdout, stderr) => {
      if (err) console.error('[watch-gallery] Generator error:', err.message);
      if (stdout) console.log(stdout.trim());
      if (stderr) console.error(stderr.trim());
    });
    timer = null;
  }, 150);
}

console.log('[watch-gallery] Watching', IMAGES_DIR);
const watcher = chokidar.watch(IMAGES_DIR, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  ignoreInitial: true,
  persistent: true,
  awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 100 }
});

watcher.on('add', runGenerator);
watcher.on('change', runGenerator);
watcher.on('unlink', runGenerator);
watcher.on('addDir', runGenerator);
watcher.on('unlinkDir', runGenerator);

process.on('SIGINT', () => {
  console.log('\n[watch-gallery] Stopping watcher.');
  watcher.close().then(() => process.exit(0));
});
