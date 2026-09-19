# Robertson Chiropractic — website

A modern, high-end marketing site for **Robertson Chiropractic LLC**
(Dr. Danielle Robertson, D.C. — Valley Center & greater Wichita, Kansas).

Static HTML, CSS and vanilla JavaScript. No build step, no framework, no
dependencies — open `index.html` and it runs.

---

## Design

The palette is sampled directly from the practice logo:

| Token | Hex | Use |
| --- | --- | --- |
| `--crimson` | `#BF1E2D` | primary — buttons, accents, the "CHIROPRACTIC" red |
| `--crimson-deep` | `#8E1520` | hovers, depth in the vertebrae mark |
| `--crimson-bright` | `#E4495C` | highlights on dark sections |
| `--rose` | `#DE727F` | secondary accent, eyebrow text on dark |
| `--blush` | `#F7EAEA` | icon tiles, soft fills |
| `--ink` | `#17171A` | body text, dark sections |
| `--bone` / `--sand` | `#FBF8F6` / `#F3EEEA` | page backgrounds |

Type is **Fraunces** (display) and **Inter** (UI), both self-hosted from
`assets/fonts/` so there is no third-party font request — faster, and nothing
about your visitors is handed to another server. Both are licensed under the
SIL Open Font License (see the `OFL-*.txt` files in that folder).

The vertebrae motif running down the hero is an SVG redraw of the spine in the
practice logo, so the brand mark is animated rather than pasted in as an image.

## Motion

Everything is deliberate and tied to focus, not decoration:

- word-by-word masked reveals on every headline
- scroll-triggered fades with stagger on sections, cards and steps
- a scroll-progress hairline in the header and a shrinking, blurring nav
- parallax on the two photographs
- cursor-following spotlight and lifting icons on the service cards
- magnetic primary buttons
- a sliding pill on the "who we help" tabs
- a scroll-linked progress rail that fills as you read the five first-visit steps
- an auto-advancing, swipeable, keyboard-accessible testimonial slider
- an animated vertebrae column in the hero

**All of it is disabled** under `prefers-reduced-motion: reduce`, and the site
is fully readable and usable with JavaScript off.

## Accessibility & SEO

- Skip link, visible focus rings, ARIA-correct tabs/slider, labelled form fields
- Semantic landmarks and a single `h1`
- `Chiropractic` JSON-LD schema with address, phone, hours and services
- Open Graph / Twitter card metadata
- Lazy-loaded images with explicit dimensions, WebP with JPEG fallback

## Structure

```
index.html              the whole site, one page
assets/css/styles.css   design tokens + all styling
assets/css/fonts.css    self-hosted @font-face declarations
assets/js/main.js       every interaction, ~330 lines, no dependencies
assets/fonts/           Fraunces + Inter woff2 subsets and their licenses
assets/img/             logo, portrait, favicon
.github/workflows/      GitHub Pages deployment
```

## Running it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing

Pushing to `main` deploys to GitHub Pages via
`.github/workflows/deploy.yml`. Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

To point `robertsonchiro.com` at it, add a `CNAME` file containing the domain
and set the DNS records GitHub lists on that same settings page.

---

## Before this goes live — things to confirm with Dr. Robertson

Content was drawn from the current robertsonchiro.com and public listings.
Please verify:

1. **Hours and address** — currently Mon–Wed 10:00–5:00, Thu 10:00–6:30, at
   1220 S Meridian Ave, Ste B, Valley Center, KS 67147.
2. **Testimonials** — the three quotes are excerpts from the existing site and
   are attributed generically. Swap in full, approved quotes with permission.
3. **"Est. 2017"** badge — based on the current site's copyright; confirm the
   founding year.
4. **Wichita Wingnuts** — the team folded after 2018. If she's no longer their
   chiropractor, reword those two mentions (hero credential row and the
   "Athletes & active" panel) to past tense or to her current team work.
5. **Appointment form** — the form currently opens the visitor's email client
   pre-filled, because there is no backend. Wire it to a form service (Formspree,
   Netlify Forms) or the practice's scheduling system, and add a privacy note if
   any health details will be collected. Nothing on this site should be used to
   transmit protected health information until that path is reviewed.
6. **New patient forms link** points at the existing WordPress site; move the PDF
   into this repo when the old site is retired.
7. **Photography** — the portrait and about images are reused from the current
   site. A short session of clinic and treatment photography would lift this
   design considerably.
