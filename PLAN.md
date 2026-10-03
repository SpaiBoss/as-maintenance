# A&S Maintenance LLC: website build plan (for Cursor)

Follow this file top to bottom. Work phase by phase (section 13). After each phase, run the acceptance checks, then stop and report. Do not skip ahead. Do not invent facts, reviews, licenses, prices or photos.

## 1. Project in one paragraph

Static marketing site for A&S Maintenance LLC, a handyman business serving the Twin Cities metro area (Minnesota). Goal: turn local mobile searchers into phone calls and text messages. There is NO backend, NO email server, NO WhatsApp. Everything is `tel:`, `sms:` and `mailto:` links. Deployed as a Render Static Site on the existing domain `asmaintenanceservices.com`.

## 2. Source-of-truth facts

Put all of these in `src/config/site.ts` and import from there. Never hardcode them in components.

```ts
export const site = {
  name: "A&S Maintenance",
  legalName: "A&S Maintenance LLC",
  url: "https://asmaintenanceservices.com",
  phoneDisplay: "612-707-3149",
  phoneE164: "+16127073149",
  email: "services@asmaintenanceservices.com", // UNVERIFIED: confirm it is live before launch
  tagline: "Quality work. Honest pricing. Reliable service.",
  region: "Twin Cities, MN",
  cities: [
    "Saint Paul","Minneapolis","Maplewood","Woodbury","Eagan",
    "Roseville","Brooklyn Park","Brooklyn Center","Bloomington","Burnsville",
  ],
  licenseNumber: null as string | null,   // render license badge ONLY if set
  insured: false,                         // render "insured" ONLY if true
  hours: null as string | null,           // render hours ONLY if set
  reviews: [] as { name: string; text: string; city?: string }[], // render reviews ONLY if non-empty
  features: { gallery: false, beforeAfter: false }, // flip on only with 6+ real job photos
  ga4Id: import.meta.env.PUBLIC_GA4_ID ?? null,
};
```

### Services (from the client flyer)

Enabled: hardwood flooring (installation, repair, refinishing), vinyl flooring (installation, repair), laminate flooring (installation, repair), drywall (repair, installation, finishing), interior painting and touch-ups, furniture assembly (all types), general handyman (door and lock repairs, caulking, and more), rental property maintenance (turnovers, repairs, ongoing maintenance).

**DISABLED until the client proves state licensing: plumbing and electrical.** The flyer lists them, but Minnesota generally requires state licenses for electrical and plumbing work. Add `enabled: false` flags and render nothing for them: no pages, no copy, no schema, no meta mentions. Also never write "licensed", "insured", "bonded" or "certified" unless the matching config value is set.

### Copy facts allowed

Free estimates, no obligation, no pressure. Residential and rental properties. No job too small. Fast response. Friendly service. Satisfaction guaranteed (define what this means on `/about/`; leave a `TODO(client)` marker). Improving homes. Building trust.

## 3. Hard rules

1. No server code, no serverless functions, no form-processing services.
2. Contact methods: call, text (SMS), email. Nothing else. No WhatsApp links, icons or mentions.
3. No fake testimonials, ratings, years in business, project counts, or "as seen on" claims.
4. No stock or AI photos presented as the client's work. Dev placeholders must be visibly marked `PLACEHOLDER` in the filename and hidden in production by the feature flags.
5. Mobile first. Design and test at 360px width before desktop.
6. Sentence case copy, active voice, plain words. CTAs say what happens ("Call 612-707-3149", "Text a photo for a free estimate").
7. Zero third-party JS except optional GA4. No chat widgets, no popups, no cookie-banner libraries, no carousels.

## 4. Stack and repo layout

Astro (static output) so header, footer and sticky bar are shared components across ~10 pages. Plain CSS with custom properties. Minimal client JS.

```
/
├─ astro.config.mjs        # site, trailingSlash:'always', build.format:'directory', @astrojs/sitemap
├─ render.yaml
├─ package.json
├─ public/
│  ├─ robots.txt
│  ├─ favicon.svg
│  └─ og-default.jpg       # 1200x630
├─ src/
│  ├─ config/site.ts
│  ├─ styles/global.css    # tokens + base + utilities
│  ├─ assets/              # source images (astro:assets optimizes to WebP/AVIF)
│  ├─ components/
│  │  ├─ Header.astro
│  │  ├─ Footer.astro
│  │  ├─ StickyContactBar.astro   # mobile only: Call | Text
│  │  ├─ ContactButtons.astro     # props: variant, trackLabel
│  │  ├─ EstimateComposer.astro   # no-backend "form"
│  │  ├─ ServiceCard.astro
│  │  ├─ ServiceAreaList.astro
│  │  ├─ ReviewList.astro         # renders nothing if reviews empty
│  │  ├─ Steps.astro
│  │  ├─ Faq.astro
│  │  ├─ Seo.astro                # title, meta, canonical, OG, JSON-LD slot
│  │  └─ TapeRule.astro           # signature visual element (section 5)
│  ├─ layouts/Base.astro
│  ├─ lib/contact.ts              # link builders (section 7)
│  └─ pages/
│     ├─ index.astro
│     ├─ flooring.astro
│     ├─ drywall-painting.astro
│     ├─ rental-property-maintenance.astro
│     ├─ furniture-assembly.astro
│     ├─ handyman-services.astro
│     ├─ service-area.astro
│     ├─ about.astro
│     ├─ contact.astro
│     ├─ gallery.astro            # exists, but excluded from nav/sitemap unless features.gallery
│     ├─ privacy.astro
│     └─ 404.astro
```

Commands: `npm create astro@latest` (empty template, strict TS), `npm i @astrojs/sitemap`. Scripts: `dev`, `build`, `preview`, `check` (`astro check`).

## 5. Design direction

Keep the flyer's brand (blue, gold, white) so the site matches his flyers and truck/shirt branding. Be workmanlike, not corporate.

Tokens (`global.css`):

```css
:root{
  --navy:#0E2A5A;   --blue:#1D4FA8;   --gold:#F5B800;
  --ink:#151A22;    --paper:#FFFFFF;  --mist:#F3F5F8;  --line:#D9DEE6;
  --font-display:"Barlow Condensed","Arial Narrow",Arial,sans-serif;
  --font-body:"Barlow",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
  --radius:6px;
}
```

- Type: Barlow Condensed (700/800) for headlines, Barlow (400/600) for body. Load from Google Fonts with `font-display:swap` and `preconnect`, or self-host via `@fontsource` (preferred: self-host, no third-party request). Line length under 70ch. Body 17px minimum on mobile.
- One memorable element: a **tape-measure rule** (gold band, black tick marks via `repeating-linear-gradient`, inch numbers) used as the hero's bottom edge and as the section divider on the home page. Everything else stays quiet: flat color, no gradients, no glassmorphism, no identical shadowed card grid. Service list uses photo-led rows, not uniform cards.
- Contrast: gold `#F5B800` only with `--ink` text, never white text. Buttons are at least 48px tall, full width on mobile.
- Motion: none except `:hover/:active` feedback and a single load-in of the tape rule. Respect `prefers-reduced-motion`.
- Visible focus rings on all interactive elements.

## 6. Page specs

Each page: one H1, title (<= 60 chars), meta description (<= 155 chars), canonical, OG tags, breadcrumbs only on service pages, `ContactButtons` above the fold and again at the bottom, StickyContactBar on mobile. Internal links between related services and to `/service-area/`.

### `/` home
- Title: `Handyman in the Twin Cities, MN | A&S Maintenance`
- Meta: `Flooring, drywall, painting, furniture assembly and rental property repairs across the Twin Cities. Free estimates. Call or text 612-707-3149.`
- H1: `Handyman services across the Twin Cities`
- Sections in order:
  1. Hero: H1, one-line subhead (services + "free estimates"), two buttons: **Call 612-707-3149** and **Text a photo for a free estimate**, service-area line, TapeRule edge. Hero image only if a real photo exists; otherwise typographic hero.
  2. Trust strip: render only what is true and set in config (reviews, license, insured, hours). If nothing is set, show the flyer-safe facts: "Free estimates · No obligation · Residential and rental properties".
  3. Services: photo-led rows linking to the service pages (flooring, drywall and painting, furniture assembly, rental property maintenance, general handyman).
  4. How it works (a real sequence): 1 Text or call with the job, 2 Get a free estimate, 3 Book a time.
  5. Why A&S: the six flyer points (professional and reliable, affordable pricing, quality workmanship, free estimates, residential and rental properties, no job too small). Short sentences, no fluff.
  6. Reviews (conditional) and Before/after (conditional on flags).
  7. Service area: city list linking to `/service-area/`.
  8. EstimateComposer.
  9. Footer.

### `/flooring/`
- Title: `Flooring Installation & Repair in the Twin Cities | A&S Maintenance`
- H1: `Hardwood, vinyl and laminate flooring`
- Content: three sub-sections (hardwood: installation, repair, refinishing; vinyl: installation, repair; laminate: installation, repair), what to send in the text photo (room size, current floor, problem area), FAQ (3 to 5 real questions with plain answers, no prices unless client supplies them), related links, CTA.

### `/drywall-painting/`
- Title: `Drywall Repair & Interior Painting | Twin Cities | A&S Maintenance`
- H1: `Drywall repair and interior painting`
- Content: drywall repair, installation, finishing; interior painting and touch-ups; what to text; FAQ; CTA.

### `/rental-property-maintenance/`
- Title: `Rental Property Maintenance & Turnovers | Twin Cities | A&S Maintenance`
- H1: `Rental property maintenance and turnovers`
- Content: landlord-focused: turnovers, repairs, ongoing maintenance; "text a list of units and issues" CTA; FAQ. This is the repeat-revenue page, so give it clear next-step copy.

### `/furniture-assembly/`
- Title: `Furniture Assembly Service | Twin Cities | A&S Maintenance`
- H1: `Furniture assembly`
- Content: all types of furniture, what to text (item, box photo or link, room), FAQ, CTA.

### `/handyman-services/`
- Title: `General Handyman Services | Twin Cities | A&S Maintenance`
- H1: `General handyman services`
- Content: door and lock repairs, caulking, and more; "if it is not listed, text us a photo and ask".

### `/service-area/`
- Title: `Service Area: Twin Cities Metro | A&S Maintenance`
- H1: `Serving the Twin Cities metro area`
- Content: the 10 cities as a plain list plus "and more", one short real paragraph, CTA. Do NOT create per-city pages in this build (see section 14).

### `/about/`
- H1: `About A&S Maintenance`
- Content: only what the client supplies: owner name, background, what "satisfaction guaranteed" means. Use `TODO(client)` markers where missing, and make `npm run build` fail if any `TODO(client)` string remains in `dist/` (add a prebuild or postbuild script: `grep -r "TODO(client)" dist && exit 1 || exit 0`).

### `/contact/`
- H1: `Call, text or email us`
- Content: three large buttons, the email shown as plain text with a **Copy** button, EstimateComposer, hours (conditional), service area line.

### `/gallery/`
- Exists but is excluded from nav and sitemap, and gets `noindex`, unless `features.gallery` is true.

### `/privacy/`
- Short plain-language page: the site has no forms or accounts, uses optional analytics (GA4) if enabled, and contact happens by phone, SMS and email.

### `/404`
- Helpful: links home, to services, and the call/text buttons.

## 7. Contact links (exact formats)

`src/lib/contact.ts`:

```ts
import { site } from "../config/site";

export const telHref = `tel:${site.phoneE164}`;

export const smsHref = (body = "") =>
  `sms:${site.phoneE164}${body ? `?&body=${encodeURIComponent(body)}` : ""}`;
  // "?&body=" is the form that works on both iOS and Android

export const mailHref = (subject = "Estimate request", body = "") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}` +
  (body ? `&body=${encodeURIComponent(body)}` : "");
```

Default text body: `Hi A&S Maintenance, I need an estimate for: ` (customer completes it, and attaches photos in their messaging app).

Rules:
- Every phone number on the page is a `tel:` link with `aria-label="Call 612-707-3149"`.
- The email address is always also shown as text with a Copy button (`navigator.clipboard`, with a text-selection fallback), because desktop users often have no mail client.
- `sms:` and `tel:` buttons are primary on mobile. On desktop, show the number as text too.

### EstimateComposer (no backend)

Fields: job type (select of enabled services), city (select of site.cities plus "Other"), details (textarea), name (optional). Client JS builds one message string:

```
Hi A&S Maintenance, I need an estimate.
Job: {job}
City: {city}
Details: {details}
Name: {name}
```

Buttons: **Text this message** (sets `location.href = smsHref(msg)`), **Email this message** (`mailHref`), **Copy message**. Without JS, the buttons must still work as plain `smsHref()`/`mailHref()` links with the empty-body defaults. No `<form action>` submission, no fetch calls, no data stored.

## 8. SEO technical requirements

- `astro.config.mjs`: `site: 'https://asmaintenanceservices.com'`, `trailingSlash: 'always'`, `build: { format: 'directory' }`, sitemap integration (filter out `/gallery/` and `/404`).
- `public/robots.txt`: allow all, `Sitemap: https://asmaintenanceservices.com/sitemap-index.xml`.
- `Seo.astro`: `<title>`, meta description, canonical (absolute URL), `og:title/description/url/image/type`, `twitter:card=summary_large_image`, `theme-color`.
- One H1 per page, logical H2/H3 order, descriptive link text (no "click here"), image `alt` text describing the actual photo, width/height on every image.
- JSON-LD on the home page (and referenced consistently elsewhere). This is a service-area business with no public street address, so do NOT output `address`.

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "A&S Maintenance",
  "legalName": "A&S Maintenance LLC",
  "url": "https://asmaintenanceservices.com/",
  "telephone": "+16127073149",
  "email": "services@asmaintenanceservices.com",
  "areaServed": [
    {"@type":"City","name":"Saint Paul"},{"@type":"City","name":"Minneapolis"}
  ],
  "slogan": "Quality work. Honest pricing. Reliable service."
}
```

Generate `areaServed` from `site.cities` (state `MN`). Add `aggregateRating`/`review` ONLY if real reviews exist in config. Skip FAQPage schema (no rich-result benefit for this site type), but keep the FAQ content on the pages.
- NAP (name, phone, email) must be identical everywhere: header, footer, contact page, schema, and (outside the code) Google Business Profile and directories.
- Internal linking: home to every service page, each service page to related services and `/service-area/`, footer links to all pages.

## 9. Analytics (optional, no consent-banner library)

If `PUBLIC_GA4_ID` is set, load gtag once in `Base.astro`. Otherwise load nothing. One delegated click listener on `[data-track]`:

| `data-track` | Event name |
|---|---|
| `call` | `click_call` |
| `text` | `click_text` |
| `email` | `click_email` |
| `composer_text` / `composer_email` | `composer_text` / `composer_email` |
| `copy_email` | `copy_email` |

Each event carries `page_path` and `placement` (`hero`, `sticky`, `footer`, `composer`). Tracking must never block navigation to the `tel:`/`sms:`/`mailto:` target.

## 10. Render deployment

`render.yaml` (Render static site; `routes` and `headers` are supported for static sites):

```yaml
services:
  - type: web
    name: as-maintenance
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      # old builder-site URLs -> new pages (301)
      - type: redirect
        source: /home
        destination: /
      - type: redirect
        source: /about-us
        destination: /about/
      - type: redirect
        source: /our-work
        destination: /
    headers:
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: Referrer-Policy
        value: strict-origin-when-cross-origin
      - path: /_astro/*
        name: Cache-Control
        value: public, max-age=31536000, immutable
```

Notes:
- If `/gallery/` goes live later, change the `/our-work` redirect to `/gallery/`.
- Custom domain: add both `asmaintenanceservices.com` and `www.asmaintenanceservices.com` in Render, point DNS where Render says (the client or whoever holds the registrar logins must do this), and verify `www` redirects to the apex. TLS is automatic.
- Do not cut DNS over until the preview URL passes every acceptance check.

## 11. Performance and accessibility budget

- Lighthouse mobile: Performance >= 90, Accessibility >= 95, SEO = 100, Best Practices >= 95.
- LCP < 2.5s on the preview URL. Hero image (if any) is preloaded, under 150KB, AVIF/WebP via `astro:assets`. All other images lazy-loaded.
- Total JS under 20KB without GA4. No layout shift (explicit image dimensions, font fallback metrics).
- All tap targets >= 48x48px. Works with keyboard only. Respects reduced motion and 200% text zoom.
- Verify on a real phone: tapping Call opens the dialer with the right number, Text opens the SMS app with the prefilled message, Email opens the mail app.

## 12. Image handling

- Source images go in `src/assets/`. Naming: `flooring-hardwood-{city}-01.jpg`, descriptive.
- Dev placeholders (flyer crops) are named `PLACEHOLDER-*.jpg` and the build must fail if any `PLACEHOLDER` file is referenced when `NODE_ENV=production`. Add that check to the postbuild script.
- The client's logo: use an SVG if he has one. A raster crop from the flyer is a temporary stopgap and must be flagged `TODO(client)`.

## 13. Phases and acceptance checks

**Phase 1: scaffold**
- [ ] Astro project, `site.ts`, `global.css` tokens, `Base.astro`, `Seo.astro`, Header, Footer, StickyContactBar, ContactButtons, `contact.ts`.
- [ ] Accept: `npm run build` passes, `npm run check` passes, the sticky bar shows only on small screens, links produce correct `tel:`/`sms:`/`mailto:` strings.

**Phase 2: home page**
- [ ] Hero with TapeRule, trust strip (conditional), services, steps, why-us, service area, EstimateComposer.
- [ ] Accept: at 360px there is no horizontal scroll, both CTAs are visible without scrolling, composer builds the right message, copy-email works.

**Phase 3: service pages + supporting pages**
- [ ] flooring, drywall-painting, rental-property-maintenance, furniture-assembly, handyman-services, service-area, about, contact, privacy, 404, gallery (hidden).
- [ ] Accept: each page has unique title and description, one H1, canonical, breadcrumbs on service pages, no disabled services mentioned anywhere (`grep -ri "plumb\|electric" src dist` returns nothing outside config comments).

**Phase 4: SEO and tracking**
- [ ] JSON-LD, sitemap, robots, OG image, GA4 events (only if ID present).
- [ ] Accept: sitemap lists only indexable pages, schema validates in Google's Rich Results Test / Schema.org validator, events fire in GA4 DebugView.

**Phase 5: deploy**
- [ ] `render.yaml`, connect repo to Render, deploy preview, run Lighthouse on the Render URL, test on a real iPhone and Android.
- [ ] Accept: section 11 budget met, redirects return 301, then attach the custom domain.

**Phase 6: after launch (not code)**
- Update Google Business Profile: primary category Handyman, website = new domain with `?utm_source=gbp&utm_medium=organic`, remove any Cleveland address or 216 phone number, add real photos, set the service area to the Twin Cities cities.
- Set up Google Search Console and submit the sitemap.
- Create a review short-link and QR code; ask for a review after every job.
- Create matching listings (Yelp, Nextdoor, BBB, Facebook) with identical name, phone and email.

## 14. Deliberately out of scope for this build

- City-specific landing pages (add one at a time later, each with real job photos and local detail, never templated duplicates).
- Blog, online booking, payments, chat, newsletter, WhatsApp.
- Plumbing and electrical pages (blocked on licensing).

## 15. Open items the client must supply (track as `TODO(client)`)

1. Confirmation that `services@asmaintenanceservices.com` is live and monitored.
2. Registrar and DNS access for `asmaintenanceservices.com`.
3. Real job photos (at least 6, ideally before/after), plus a logo SVG.
4. Which trades he is actually licensed for, license numbers, and insurance status.
5. Owner name and short background; what "satisfaction guaranteed" means in practice.
6. Real customer reviews with permission to publish.
7. Working hours, if any.
