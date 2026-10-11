# Reyner Pantou — Personal Website

A professional, English-language portfolio with an editorial layout, warm off-white palette, muted blue accents, and locally hosted Inter. Built with Astro and Tailwind CSS, output as static HTML for Cloudflare Workers Static Assets.

## Run locally

Requirements: Node.js 24 and npm.

```sh
npm ci
npm run dev
```

```sh
npm run check   # Astro and TypeScript checks
npm test        # Build, then verify routes, metadata, links, and fragments
npm run preview # Preview the production build locally
```

## Structure and content

- `src/data/site.ts`: profile, project descriptions, and case study content.
- `src/pages/index.astro`: introduction, selected work, experience, writing, about, and contact.
- `src/pages/work/[slug].astro`: static project detail pages.
- `src/pages/writing/`: engineering notes, starting with the BookCabin cache design.
- `src/layouts/Base.astro`: navigation, metadata, structured data, and footer.
- `src/styles/global.css`: design tokens, responsive layout, and reduced-motion support.
- `public/`: favicon, social preview image, robots file, and response headers.

Professional work is described at a high level without internal performance or business metrics. BookCabin uses mocked providers; the financial tracker is explicitly marked as work in progress. Contact currently links to the verified GitHub profile. Add email, LinkedIn, a résumé, or a portrait only after the real assets and addresses are available.

## Deploy to Cloudflare

```sh
npm run build
npx wrangler login
npm run deploy
```

`wrangler.jsonc` serves `dist/` directly, with trailing-slash handling and a custom 404 page. No database, server runtime, or Cloud Run service is needed for this portfolio.

For Git-connected Cloudflare Workers builds:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root

Once the Worker exists, add `reynerpantou.com` as a custom domain in its Cloudflare dashboard. Project subdomains can be configured independently; this repository owns the personal landing page only. No domain or hosting account configuration is performed by this change.

The canonical site URL is defined in `astro.config.mjs`; update that and `public/robots.txt` if the domain changes. Social metadata uses `public/social-card.png`, with the editable SVG source alongside it.

## Verification

GitHub Actions runs type checks, a production build, and generated-site tests. The tests check every page’s English language attribute, heading and main landmark, metadata, structured data, internal paths, anchor links, and local assets. They do not replace visual browser review or Lighthouse measurements; Core Web Vitals and WCAG conformance are not claimed without measurement.

Design choices include native anchor navigation, visible keyboard focus, a skip link, semantic landmarks, responsive grids, and reduced-motion handling. No client-side JavaScript is needed for the portfolio.
