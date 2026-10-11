# Reyner Pantou — Personal Website

An English-language professional portfolio built with Astro and Tailwind CSS. All pages are generated as static HTML for **Cloudflare Pages**, with warm off-white, muted blue, and locally hosted Inter.

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

- `src/data/site.ts`: profile, verified email and LinkedIn, and work descriptions.
- `src/pages/index.astro`: introduction, selected work, experience, CV, about, and contact.
- `src/pages/work/[slug].astro`: professional work and ongoing personal project detail pages.
- `src/pages/cv.astro`: embedded CV viewer with direct-open and download fallbacks.
- `public/cv/reyner-pantou-cv.pdf`: the original uploaded CV, served as a static file.
- `src/layouts/Base.astro`: navigation, search and social metadata, and footer.
- `src/styles/global.css`: responsive layouts, design tokens, focus styles, and reduced-motion support.

The portfolio excludes take-home assignments and public GitHub repository listings or links. The CV PDF is retained unchanged. Replace `public/cv/reyner-pantou-cv.pdf` with a newer PDF to update every CV link and the embedded viewer in the next build. Keep this filename stable.

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

The implementation is currently on `feat/professional-portfolio` for review; merge the pull request to `main` before the first production deployment. Cloudflare Pages can create previews for this branch once Git integration is connected.

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

Browser visual QA and Lighthouse measurements are still needed before claiming measured accessibility conformance or Core Web Vitals results.
