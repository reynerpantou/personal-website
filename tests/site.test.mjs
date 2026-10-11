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
  for (const route of ['/', '/work/commerce-search/', '/work/financial-tracker/', '/cv/', '/404.html']) {
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

test('homepage exposes every section and labels unfinished work', () => {
  const home = pages.get('/');
  for (const id of ['work', 'experience', 'resume', 'about', 'contact']) assert.ok(home.some(node => attr(node, 'id') === id));
  const project = pageText(pages.get('/work/financial-tracker/'));
  assert.match(project, /work in progress, not a released product/);
});

test('only approved pages are published and public repository links are absent', async () => {
  assert.deepEqual([...pages.keys()].sort(), [
    '/', '/404.html', '/cv/', '/work/commerce-search/', '/work/financial-tracker/',
  ].sort());
  for (const file of files.filter(file => /\.(html|xml)$/.test(file))) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /github\.com\/reynerpantou/i);
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
  for (const elements of pages.values()) {
    assert.ok(!elements.some(node => node.tagName === 'script' && attr(node, 'type') !== 'application/ld+json'));
  }
});

function pageText(elements) { return elements.filter(node => node.nodeName === '#text').map(node => node.value).join(' '); }
