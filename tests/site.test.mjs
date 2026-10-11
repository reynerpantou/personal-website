import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { parse } from 'parse5';
import { runInNewContext } from 'node:vm';

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
  assert.match(pageText(home), /TikTok Search Platform Integration/);
  assert.match(pageText(home), /High-Value User Coupon Experiment/);
  assert.match(pageText(home), /Combined team program/);
  assert.match(pageText(home), /results are not cumulative/);
  assert.doesNotMatch(pageText(home), /Code reviews in 2023|Architecture Review Board presentations|My service scope at TikTok|What I’m responsible for/);
  const migration = pageText(pages.get('/work/search-platform-migration/'));
  assert.match(migration, /1,200 ms to 850 ms/);
  assert.match(migration, /What I owned/);
  assert.match(migration, /Business impact/);
  assert.match(migration, /Technical impact/);
});

test('experience responsibilities are visible without JavaScript and the portrait is local', () => {
  const home = pages.get('/');
  for (const company of ['ByteDance', 'Tokopedia']) {
    const list = home.find(node => node.tagName === 'ul' && attr(node, 'aria-label') === `${company} responsibilities`);
    assert.ok(list);
    assert.ok(nodes(list).some(node => node.tagName === 'li' && pageText(nodes(node)).trim().length > 20));
    assert.ok(nodes(list).some(node => node.tagName === 'strong'));
  }
  assert.ok(!home.some(node => node.tagName === 'details' || node.tagName === 'summary'));
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
  const impact = pages.get('/').find(node => attr(node, 'class') === 'career-impact');
  assert.ok(impact);
  assert.equal(nodes(impact).filter(node => node.tagName === 'dl').length, 3);
  assert.match(pageText(nodes(impact)), /Commerce Growth/);
  assert.match(pageText(nodes(impact)), /Operating Efficiency/);
  assert.match(pageText(nodes(impact)), /Production Delivery/);
  assert.match(pageText(nodes(impact)), /High-Value User Coupon Experiment/);
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
  assert.ok(cv.some(node => node.tagName === 'a' && attr(node, 'href') === '/#resume' && /Back to Portfolio/.test(pageText(nodes(node)))));
});

test('email copying reports success and supports manual copying when clipboard access fails', async () => {
  const home = pages.get('/');
  const address = home.find(node => attr(node, 'id') === 'contact-email');
  const copy = home.find(node => node.tagName === 'button' && attr(node, 'aria-label') === 'Copy email address');
  const email = pageText(nodes(address)).trim();
  assert.equal(attr(copy, 'type'), 'button');
  assert.equal(attr(copy, 'data-email'), email);
  assert.equal(attr(copy, 'hidden'), '', 'Copy control stays hidden without scripting; address remains readable');
  assert.ok(home.some(node => attr(node, 'role') === 'status' && attr(node, 'aria-live') === 'polite'));
  const scripts = await Promise.all(home.filter(node => node.tagName === 'script' && attr(node, 'type') === 'module').map(async node => {
    const src = attr(node, 'src');
    return src ? readFile(join(root, new URL(src, origin).pathname), 'utf8') : pageText(nodes(node));
  }));
  const code = scripts.find(script => script.includes('clipboard'));
  assert.ok(code, 'Shipped clipboard enhancement must be exercised');
  for (const scenario of ['success', 'denied', 'unavailable']) {
    let click, copied, selected = false;
    const button = { hidden: true, disabled: false, dataset: { email }, addEventListener: (_, handler) => { click = handler; } };
    const status = { textContent: '' };
    const emailNode = {};
    const clipboard = scenario === 'unavailable' ? undefined : { writeText: async value => {
      if (scenario === 'denied') throw new Error('Clipboard permission denied');
      copied = value;
    } };
    runInNewContext(code, {
      navigator: { clipboard },
      document: {
        querySelector: selector => selector === '.copy-email' ? button : status,
        getElementById: () => emailNode,
        createRange: () => ({ selectNodeContents: value => { assert.equal(value, emailNode); } }),
      },
      window: { getSelection: () => ({ removeAllRanges() {}, addRange() { selected = true; } }) },
    });
    assert.equal(button.hidden, false);
    await click();
    assert.equal(button.disabled, false, `${scenario}: control must remain usable`);
    if (scenario === 'success') {
      assert.equal(copied, email);
      assert.equal(status.textContent, 'Email copied.');
    } else {
      assert.equal(selected, true);
      assert.match(status.textContent, /copy the email address/i);
    }
  }
});

test('case studies expose summaries, native section navigation, and onward routes', () => {
  const cases = [...pages].filter(([route]) => route.startsWith('/work/'));
  const onward = new Map();
  for (const [route, elements] of cases) {
    const overview = elements.find(node => node.tagName === 'dl' && attr(node, 'aria-label') === 'Case study at a glance');
    assert.ok(overview, `${route}: missing summary`);
    assert.deepEqual(nodes(overview).filter(node => node.tagName === 'dt').map(node => pageText(nodes(node)).trim()), ['Role', 'Delivery', 'Tech Stack', 'Impact']);
    assert.ok(nodes(overview).filter(node => node.tagName === 'dd').every(node => pageText(nodes(node)).trim().length > 0));
    const contents = elements.find(node => node.tagName === 'nav' && attr(node, 'aria-label') === 'On this page');
    const links = nodes(contents).filter(node => node.tagName === 'a');
    assert.deepEqual(links.map(node => attr(node, 'href')), ['#problem', '#architecture', '#execution', '#result']);
    for (const link of links) {
      const section = elements.find(node => attr(node, 'id') === attr(link, 'href').slice(1));
      assert.equal(section?.tagName, 'section');
      assert.ok(nodes(section).some(node => node.tagName === 'h2' && attr(node, 'id') === attr(section, 'aria-labelledby')));
    }
    const crumbs = elements.find(node => node.tagName === 'nav' && attr(node, 'aria-label') === 'Breadcrumb');
    assert.deepEqual(nodes(crumbs).filter(node => node.tagName === 'a').map(node => attr(node, 'href')), ['/', '/#work']);
    const actions = elements.find(node => node.tagName === 'nav' && attr(node, 'aria-label') === 'Continue exploring');
    const next = nodes(actions).find(node => node.tagName === 'a' && attr(node, 'data-prefetch') !== undefined);
    const nextRoute = attr(next, 'href');
    assert.ok(pages.has(nextRoute) && nextRoute !== route);
    onward.set(route, nextRoute);
    assert.ok(nodes(actions).some(node => node.tagName === 'a' && attr(node, 'href') === '/cv/reyner-pantou-cv.pdf'));
    for (const image of elements.filter(node => node.tagName === 'img' && attr(node, 'src')?.startsWith('/diagrams/'))) {
      assert.ok(attr(image, 'alt').length > 40);
      assert.equal(attr(image, 'loading'), 'lazy');
      const region = image.parentNode;
      assert.equal(attr(region, 'role'), 'region');
      assert.equal(attr(region, 'tabindex'), '0');
    }
  }
  const first = cases[0][0], visited = new Set();
  let current = first;
  do { visited.add(current); current = onward.get(current); } while (!visited.has(current));
  assert.equal(current, first);
  assert.equal(visited.size, cases.length, 'Read Next must traverse all case studies');
});

test('intent prefetch respects cancellation, data saving, boundaries, and deduplication', async () => {
  const scripts = await Promise.all(pages.get('/').filter(node => node.tagName === 'script' && attr(node, 'type') === 'module').map(async node => attr(node, 'src') ? readFile(join(root, attr(node, 'src')), 'utf8') : pageText(nodes(node))));
  const code = scripts.find(script => script.includes('prefetch') && script.includes('touchstart'));
  assert.ok(code, 'Exercise the shipped prefetch enhancement');
  for (const scenario of ['hint', 'fetch', 'offline', 'saveData', '2g', 'slow-2g']) {
    const timers = new Map(), hints = [], requests = [];
    let timerId = 0;
    const links = ['/work/commerce-search/', '/work/search-performance/', '/cv/reyner-pantou-cv.pdf', 'https://example.com/work/case/'].map(href => ({
      href: new URL(href, origin).href, handlers: {}, addEventListener(type, handler) { this.handlers[type] = handler; },
    }));
    runInNewContext(code, {
      URL, Set,
      navigator: { onLine: scenario !== 'offline', connection: { saveData: scenario === 'saveData', effectiveType: scenario.includes('2g') ? scenario : '4g' } },
      window: { location: { href: origin + '/', origin } },
      document: { querySelectorAll: () => links, createElement: () => ({ relList: { supports: () => scenario === 'hint' } }), head: { append: hint => hints.push(hint) } },
      fetch: (url, options) => { requests.push({ url, options }); return Promise.resolve(); },
      setTimeout: (handler, delay) => { assert.equal(delay, 120); timers.set(++timerId, handler); return timerId; },
      clearTimeout: id => timers.delete(id),
    });
    const flush = () => { for (const handler of timers.values()) handler(); timers.clear(); };
    assert.equal(hints.length + requests.length, 0, 'No speculative download on initial page load');
    links[0].handlers.pointerenter({ pointerType: 'mouse' });
    links[0].handlers.pointerleave(); flush();
    assert.equal(hints.length + requests.length, 0, 'Brief hover cancels prefetch');
    links[0].handlers.focus(); links[0].handlers.blur(); flush();
    assert.equal(hints.length + requests.length, 0, 'Brief focus cancels prefetch');
    links[0].handlers.pointerenter({ pointerType: 'touch' }); flush();
    assert.equal(hints.length + requests.length, 0, 'Touch pointer entry alone is not intent');
    links[0].handlers.pointerenter({ pointerType: 'mouse' }); links[0].handlers.focus(); flush();
    links[0].handlers.touchstart();
    links[1].handlers.touchstart();
    links[2].handlers.touchstart(); links[3].handlers.touchstart();
    const allowed = scenario === 'hint' || scenario === 'fetch';
    assert.equal(hints.length + requests.length, allowed ? 2 : 0, `${scenario}: only distinct same-origin case pages may be warmed`);
    if (scenario === 'hint') for (const hint of hints) { assert.equal(hint.rel, 'prefetch'); assert.equal(hint.as, 'document'); }
    if (scenario === 'fetch') for (const request of requests) { assert.equal(request.options.priority, 'low'); assert.equal(request.options.credentials, 'same-origin'); }
  }
});

test('case reading navigation tracks manual scroll, resizing, and the final section', async () => {
  const elements = pages.get('/work/commerce-search/');
  const scripts = await Promise.all(elements.filter(node => node.tagName === 'script' && attr(node, 'type') === 'module').map(async node => attr(node, 'src') ? readFile(join(root, attr(node, 'src')), 'utf8') : pageText(nodes(node))));
  const code = scripts.find(script => script.includes('.case-toc nav'));
  assert.ok(code);
  const ids = ['problem', 'architecture', 'execution', 'result'];
  const links = ids.map(id => ({ hash: '#' + id, current: undefined, setAttribute(_, value) { this.current = value; }, removeAttribute() { this.current = undefined; } }));
  const frames = [], handlers = {};
  const window = { scrollY: 0, innerHeight: 600, innerWidth: 1200, addEventListener: (type, handler) => { handlers[type] = handler; } };
  const sections = ids.map((id, index) => ({ id, getBoundingClientRect: () => ({ top: 180 + index * 550 - window.scrollY }) }));
  runInNewContext(code, {
    window,
    document: { querySelector: () => ({ querySelectorAll: () => links }), getElementById: id => sections.find(section => section.id === id), documentElement: { scrollHeight: 2400 } },
    requestAnimationFrame: handler => frames.push(handler),
  });
  const current = () => links.filter(link => link.current).map(link => link.hash);
  const flush = () => frames.splice(0).forEach(handler => handler());
  assert.deepEqual(current(), ['#problem']);
  window.scrollY = 800;
  handlers.scroll(); handlers.scroll();
  assert.equal(frames.length, 1, 'Scroll updates must be bounded to a single animation frame');
  flush(); assert.deepEqual(current(), ['#architecture']);
  window.scrollY = 1150;
  handlers.scroll(); flush(); assert.deepEqual(current(), ['#execution']);
  window.innerWidth = 390;
  handlers.resize(); flush(); assert.deepEqual(current(), ['#architecture']);
  window.scrollY = 1800;
  handlers.scroll(); flush(); assert.deepEqual(current(), ['#result']);
});

test('Cloudflare Pages output is static and allows the CV to embed on the same origin', async () => {
  assert.ok(files.includes(join(root, '404.html')));
  assert.ok(files.includes(join(root, '_headers')));
  assert.match(await readFile(join(root, '_headers'), 'utf8'), /X-Frame-Options: SAMEORIGIN/);
  assert.ok(!files.some(file => /(?:^|[/\\])(?:_worker\.js|functions|server)(?:[/\\]|$)/.test(relative(root, file))));
  for (const [route, elements] of pages) {
    const interactive = elements.filter(node => node.tagName === 'script' && attr(node, 'type') !== 'application/ld+json');
    assert.equal(interactive.length, route === '/' || route.startsWith('/work/') ? 3 : 1, 'Only scoped navigation, copy, and prefetch enhancements are shipped');
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
