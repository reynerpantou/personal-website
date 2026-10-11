import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { parse } from 'parse5';

const root = resolve('dist');
const origin = 'https://reynerpantou.com';
async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = await Promise.all(entries.map(entry => entry.isDirectory() ? collect(join(directory, entry.name)) : join(directory, entry.name)));
  return result.flat();
}
const files = await collect(root);
const pages = new Map();
function nodes(node) { return [node, ...(node.childNodes ?? []).flatMap(nodes)]; }
function attr(node, name) { return node.attrs?.find(item => item.name === name)?.value; }
for (const file of files.filter(file => file.endsWith('.html'))) {
  const path = '/' + relative(root, file).replace(/index\.html$/, '');
  pages.set(path, nodes(parse(await readFile(file, 'utf8'))));
}

test('all portfolio and CV routes are emitted', () => {
  for (const route of ['/', '/work/commerce-search/', '/work/search-platform-migration/', '/work/search-performance/', '/work/search-monetization/', '/work/commerce-experience/', '/work/search-reliability/', '/cv/', '/404.html']) {
    assert.ok(pages.has(route), `Missing ${route}`);
  }
});

for (const [route, elements] of pages) {
  test(`${route}: English, landmarks, and search metadata`, () => {
    assert.equal(attr(elements.find(node => node.tagName === 'html'), 'lang'), 'en');
    assert.equal(elements.filter(node => node.tagName === 'h1').length, 1);
    assert.equal(elements.filter(node => node.tagName === 'main').length, 1);
    const title = elements.find(node => node.tagName === 'title');
    assert.ok(title?.childNodes.some(node => node.value?.includes('Reyner Pantou')));
    assert.ok(elements.some(node => node.tagName === 'meta' && attr(node, 'name') === 'description' && attr(node, 'content')));
    const canonical = elements.find(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
    assert.equal(attr(canonical, 'href'), origin + route);
    const json = elements.find(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json');
    assert.equal(JSON.parse(json.childNodes[0].value).name, 'Reyner Pantou');
  });

  test(`${route}: navigation, fragments, and local assets resolve`, () => {
    for (const node of elements) {
      for (const attribute of ['href', 'src', 'data']) {
        const value = attr(node, attribute);
        if (!value || (attribute === 'data' && node.tagName !== 'object') || /^(mailto:|tel:|data:)/.test(value)) continue;
        const url = new URL(value, origin + route);
        if (url.origin !== origin) continue;
        const target = pages.get(url.pathname);
        if (target) {
          if (url.hash) assert.ok(target.some(node => attr(node, 'id') === decodeURIComponent(url.hash.slice(1))), `${value} has a missing anchor`);
        } else {
          assert.ok(files.includes(join(root, url.pathname)), `${value} does not resolve`);
        }
      }
      if (attr(node, 'target') === '_blank') assert.match(attr(node, 'rel') ?? '', /noopener/);
    }
  });
}

test('homepage exposes every section and describes delivered ownership', () => {
  const home = pages.get('/');
  for (const id of ['work', 'experience', 'resume', 'about', 'contact']) assert.ok(home.some(node => attr(node, 'id') === id));
  assert.match(pageText(home), /user-facing search API layer/i);
  assert.match(pageText(home), /Search Provider.*engine aggregator/is);
  assert.match(pageText(home), /Search Pack.*item and component packer/is);
  assert.match(pageText(home), /Limited ingestion-service contributions/i);
  assert.doesNotMatch(pageText(home), /technical owner of Tokopedia’s Search Result Page/i);
  assert.match(pageText(home), /May vs\. April 2024/);
  assert.match(pageText(home), /High-value-user coupon experiment/);
  assert.match(pageText(home), /Combined team program/);
  assert.match(pageText(home), /results are not cumulative/);
  assert.doesNotMatch(pageText(home), /Code reviews in 2023|Architecture Review Board presentations|My service scope at TikTok|What I’m responsible for/);
  const migration = pageText(pages.get('/work/search-platform-migration/'));
  assert.match(migration, /1,200 ms to 850 ms/);
  assert.match(migration, /What I owned/);
  assert.match(migration, /Business impact/);
  assert.match(migration, /Technical impact/);
});

test('experience explanations remain accessible without JavaScript and the portrait is local', () => {
  const home = pages.get('/');
  const details = home.filter(node => node.tagName === 'details' && attr(node, 'class') === 'inline-info');
  assert.ok(details.length > 0);
  for (const detail of details) {
    assert.equal(attr(detail, 'open'), undefined, 'Details start compact');
    const children = nodes(detail);
    assert.ok(children.some(node => node.tagName === 'summary'));
    assert.ok(children.some(node => attr(node, 'class') === 'info-panel' && pageText(nodes(node)).trim().length > 20));
  }
  const portrait = home.find(node => node.tagName === 'img');
  assert.equal(attr(portrait, 'src'), '/reyner-pantou.webp');
  assert.equal(attr(portrait, 'alt'), 'Portrait of Reyner Pantou');
  assert.equal(attr(portrait, 'width'), '400');
  assert.equal(attr(portrait, 'height'), '400');
  assert.ok(home.some(node => node.tagName === 'a' && attr(node, 'href') === 'https://www.linkedin.com/in/reyner-pantou/'));
});

test('mobile navigation reaches home sections consistently from every page', () => {
  for (const [route, elements] of pages) {
    const dock = elements.find(node => node.tagName === 'nav' && attr(node, 'aria-label') === 'Mobile navigation');
    assert.ok(dock, `${route}: missing persistent mobile navigation`);
    const links = nodes(dock).filter(node => node.tagName === 'a');
    assert.deepEqual(links.map(node => pageText(nodes(node)).trim()), ['Home', 'Work', 'Career', 'CV', 'Contact']);
    for (const link of links) {
      const target = new URL(attr(link, 'href'), origin + route);
      assert.equal(target.pathname, '/');
      assert.equal(target.hash, `#${attr(link, 'data-section')}`);
      assert.ok(pages.get('/').some(node => attr(node, 'id') === target.hash.slice(1)));
    }
    const current = links.filter(node => attr(node, 'aria-current'));
    assert.equal(current.length, 1);
    assert.equal(attr(current[0], 'data-section'), route.startsWith('/work/') ? 'work' : route === '/cv/' ? 'resume' : 'main');
    const viewport = elements.find(node => node.tagName === 'meta' && attr(node, 'name') === 'viewport');
    assert.match(attr(viewport, 'content'), /viewport-fit=cover/);
  }
  const impact = pages.get('/').find(node => node.tagName === 'details' && attr(node, 'class') === 'impact-details');
  assert.ok(impact);
  assert.equal(attr(impact, 'open'), undefined);
  assert.match(pageText(nodes(impact)), /View all outcomes/);
  assert.match(pageText(nodes(impact)), /High-value-user coupon experiment/);
});

test('only approved pages are published and public repository links are absent', async () => {
  assert.deepEqual([...pages.keys()].sort(), [
    '/', '/404.html', '/cv/', '/work/commerce-search/', '/work/search-platform-migration/',
    '/work/search-performance/', '/work/search-monetization/', '/work/commerce-experience/',
    '/work/search-reliability/',
  ].sort());
  for (const file of files.filter(file => /\.(html|xml)$/.test(file))) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /github\.com\/reynerpantou/i);
    assert.doesNotMatch(await readFile(file, 'utf8'), /financial.tracker/i);
  }
});

test('the CV is a real PDF copied unchanged and has view/download links', async () => {
  const original = await readFile('public/cv/reyner-pantou-cv.pdf');
  const deployed = await readFile(join(root, 'cv/reyner-pantou-cv.pdf'));
  assert.equal(deployed.subarray(0, 5).toString(), '%PDF-');
  assert.deepEqual(deployed, original);
  const cv = pages.get('/cv/');
  assert.ok(cv.some(node => node.tagName === 'object' && attr(node, 'data') === '/cv/reyner-pantou-cv.pdf' && attr(node, 'type') === 'application/pdf'));
  assert.ok(cv.some(node => node.tagName === 'a' && attr(node, 'href') === '/cv/reyner-pantou-cv.pdf' && attr(node, 'download')));
});

test('Cloudflare Pages output is static and allows the CV to embed on the same origin', async () => {
  assert.ok(files.includes(join(root, '404.html')));
  assert.ok(files.includes(join(root, '_headers')));
  assert.match(await readFile(join(root, '_headers'), 'utf8'), /X-Frame-Options: SAMEORIGIN/);
  assert.ok(!files.some(file => /(?:^|[/\\])(?:_worker\.js|functions|server)(?:[/\\]|$)/.test(relative(root, file))));
  for (const [route, elements] of pages) {
    const interactive = elements.filter(node => node.tagName === 'script' && attr(node, 'type') !== 'application/ld+json');
    assert.equal(interactive.length, route === '/' ? 3 : 1, 'Only small navigation and details enhancements are shipped');
    for (const script of interactive) assert.equal(attr(script, 'type'), 'module');
  }
});

test('text colors meet WCAG AA contrast on neutral and colored surfaces', async () => {
  const css = await readFile('src/styles/global.css', 'utf8');
  const tokens = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[\da-f]{6});/gi)].map(([, name, color]) => [name, color]));
  for (const background of ['background', 'surface', 'surface-hover', 'blue-surface', 'coral-surface', 'amber-surface']) {
    for (const foreground of ['text', 'muted', 'accent', 'blue', 'coral', 'mint']) {
      const ratio = contrast(tokens[foreground], tokens[background]);
      assert.ok(ratio >= 4.5, `${foreground} on ${background}: ${ratio.toFixed(2)}:1`);
    }
  }
  assert.ok(contrast(tokens.background, tokens.accent) >= 4.5, 'Primary button label contrast');
});

test('homepage assets stay lightweight with one local portrait and small interaction scripts', async () => {
  const home = pages.get('/');
  const stylesheets = home.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'stylesheet');
  assert.ok(stylesheets.length > 0, 'The homepage should have a stylesheet');
  let total = (await readFile(join(root, 'index.html'))).length;
  const fonts = new Set();
  for (const node of stylesheets) {
    const url = new URL(attr(node, 'href'), origin);
    assert.equal(url.origin, origin, 'Stylesheets must be hosted locally');
    const css = await readFile(join(root, url.pathname), 'utf8');
    total += Buffer.byteLength(css);
    for (const [, value] of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const asset = new URL(value, url);
      assert.equal(asset.origin, origin, 'CSS assets must be hosted locally');
      assert.ok(asset.pathname.endsWith('.woff2'), 'No decorative image downloads');
      fonts.add(asset.pathname);
    }
  }
  assert.equal(fonts.size, 1, 'Only one variable font should be shipped');
  for (const font of fonts) total += (await readFile(join(root, font))).length;
  let scriptBytes = 0;
  for (const node of home.filter(node => node.tagName === 'script' && attr(node, 'type') === 'module')) {
    const source = attr(node, 'src');
    if (source) {
      const url = new URL(source, origin);
      assert.equal(url.origin, origin);
      const bytes = (await readFile(join(root, url.pathname))).length;
      scriptBytes += bytes; total += bytes;
    } else scriptBytes += Buffer.byteLength(pageText(nodes(node)));
  }
  assert.ok(scriptBytes < 3 * 1024, `Interaction scripts total ${scriptBytes} bytes`);
  assert.ok(total < 100 * 1024, `HTML, CSS, font and script total ${total} bytes`);
  const images = home.filter(node => node.tagName === 'img');
  assert.equal(images.length, 1, 'Only the requested portrait is loaded');
  const photoBytes = (await readFile(join(root, attr(images[0], 'src')))).length;
  assert.ok(photoBytes < 35 * 1024, `Portrait totals ${photoBytes} bytes`);
  total += photoBytes;
  assert.ok(total < 135 * 1024, `All homepage assets total ${total} bytes`);
  assert.ok(!home.some(node => node.tagName === 'video'));
});

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
function pageText(elements) { return elements.filter(node => node.nodeName === '#text').map(node => node.value).join(' '); }
