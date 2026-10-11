# Reyner Pantou — Personal Website

An English-language professional portfolio built with Astro and plain CSS. All pages are generated as static HTML for **Cloudflare Pages**, with charcoal backgrounds, warm amber actions, sky blue and coral panels, and one locally hosted Latin Inter variable font.

## Run locally

Requirements: Node.js 24 and npm.

```sh
npm ci
npm run dev
```

```sh
npm run check   # Astro and TypeScript checks
npm test        # Build and validate the generated site
npm run preview # Preview the static production build
```

## Content

- `src/data/site.ts`: profile, verified contact details, career ownership, and six delivered workstreams with scoped business and technical metrics.
- `src/pages/index.astro`: introduction, selected work, experience, CV, about, and contact.
- `src/pages/work/[slug].astro`: professional work and ongoing personal project detail pages.
- `src/pages/cv.astro`: embedded CV viewer with direct-open and download fallbacks.
- `public/cv/reyner-pantou-cv.pdf`: the original uploaded CV, served as a static file.
- `src/layouts/Base.astro`: navigation, search and social metadata, and footer.
- `src/styles/global.css`: responsive layouts, design tokens, focus styles, and reduced-motion support.

The portfolio excludes take-home assignments, undeveloped personal projects, and public GitHub repository listings or links. Case studies separate direct ownership from reported team or experiment outcomes, and preserve measurement scope. Monthly comparisons are labeled separately from experiments; estimated engineering savings are identified as estimates.

Ownership is scoped to the user-facing search API layer at TikTok: Search API, Search Provider (engine aggregator), and Search Pack (item/component packer). The company-specific experience distinguishes this service ownership from Tokopedia work on search APIs across surfaces, retrieval, fine ranking, NLP, blacklists, and limited pre-indexing ingestion contributions. It does not imply ownership of the entire search organization or all search engines.

Career content is based on the provided 2022–2023 calibration decks, 2024–2025 performance notes, and CV. Raw internal documents, screenshots, and internal URLs are not published with the site. The supplied CV matches the existing PDF byte for byte and is retained unchanged. Replace `public/cv/reyner-pantou-cv.pdf` with a newer PDF to update every CV link and the embedded viewer in the next build. Keep this filename stable.

## Deploy on Cloudflare Pages

In Cloudflare, choose **Workers & Pages → Create application → Pages → Connect to Git**, then select this repository.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root |
| Node version | `24` (`.node-version`, or build variable `NODE_VERSION=24`) |

Cloudflare Pages can create branch previews once Git integration is connected; merging a pull request deploys it to production when automatic builds are enabled.

There are no Pages Functions, server-rendered routes, or Worker entrypoints. `astro.config.mjs` explicitly uses `output: 'static'`; Cloudflare serves only generated files from `dist/`. The output includes `404.html` for normal static-site 404 behavior rather than a single-page-app fallback, plus `_headers` for response headers. Same-origin framing is allowed so the CV can be embedded.

Optional direct upload, after creating a Pages project named `reyner-personal-website`:

```sh
npm run build
npx wrangler login
npm run deploy
```

The deploy script uses `wrangler pages deploy`, not Worker deployment. Adjust its project name if your Pages project uses a different name. Git integration is the recommended route for automatic deployment on future commits.

After the Pages deployment succeeds, open its **Custom domains** tab and add `reynerpantou.com`. Configure the apex domain through that Pages flow. Project subdomains can be managed separately.

The canonical URL is in `astro.config.mjs`; update that and `public/robots.txt` if the domain changes. Social previews use `public/social-card.png` with the editable SVG alongside it.

## Verification

GitHub Actions runs type checking, the production build, and generated-site tests. Tests validate English page metadata, landmarks, internal paths, fragments, local assets, and CV viewing/download links; verify the PDF is copied unchanged; check excluded work stays absent; and verify static output has no Worker entrypoints or client JavaScript.

The layout uses flexible grids and wrapping navigation, with a mobile breakpoint at 700px. Body text stays at 16px, links have visible keyboard focus, navigation and action links have touch targets of at least 44px, and reduced-motion preferences disable transitions. There is no client JavaScript, animation loop, external font request, or image download on the homepage. Tailwind was removed because the design uses custom CSS throughout.

Tests also enforce WCAG AA contrast ratios for text colors on neutral and colored surfaces and a 100 KiB combined budget for the homepage HTML, shared CSS, and font. These checks do not replace browser testing. Browser visual QA across phone, tablet, and desktop sizes and Lighthouse measurements are still needed before claiming measured accessibility conformance or Core Web Vitals results.
