const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("shows the supplied video as the primary media in the hero", () => {
  const heroStart = html.indexOf('<section class="hero">');
  const heroEnd = html.indexOf('<section class="section">', heroStart);
  const hero = html.slice(heroStart, heroEnd);
  const linksIndex = hero.indexOf('class="publication-links"');
  const videoIndex = hero.indexOf('<video class="hero-video"');
  const overviewIndex = hero.indexOf('<img src="hiwm.png"');

  assert.ok(heroStart >= 0 && heroEnd > heroStart, "hero section should exist");
  assert.ok(videoIndex > linksIndex, "video should appear below the publication links");
  assert.ok(videoIndex < overviewIndex, "video should appear before the overview figure");

  const videoTag = hero.slice(videoIndex, hero.indexOf(">", videoIndex) + 1);
  assert.match(videoTag, /\bcontrols\b/);
  assert.match(videoTag, /\bplaysinline\b/);
  assert.match(videoTag, /preload="metadata"/);
  assert.match(videoTag, /aria-label="Hi-WM project video"/);
  assert.match(
    hero,
    /<source src="9be7605cdfc352d6486b6f8979432923\.mp4" type="video\/mp4"\s*\/?>/
  );
});

test("sizes the primary video responsively without cropping", () => {
  assert.match(html, /\.hero-video\s*\{[^}]*width:\s*100%/s);
  assert.match(html, /\.hero-video\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  assert.match(html, /\.hero-video\s*\{[^}]*object-fit:\s*contain/s);
});
