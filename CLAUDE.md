# Abaid Dental Care — website

Static marketing site for a dental clinic in Gulshan Iqbal, Faisalabad, Pakistan.
The copy is written and approved. This repo builds it; it does not rewrite it.

## Stack

* Next.js, latest stable, App Router, TypeScript, `output: 'export'` (fully static)
* Tailwind CSS v4
* Next.js's own toolchain only. Not Vinext, not any Vite-based setup
* Content: markdown in `content/`, parsed at build time with `gray-matter`,
rendered with `react-markdown` + `remark-gfm`. Format spec: `docs/content-format.md`
* Fonts via `next/font`. Images via `next/image` with `unoptimized: true` (static export)
* Deploys to Vercel. No API routes, no server actions, no database, no forms
* Package manager: pnpm

## Styling

Tailwind utility classes in components, and nowhere else.

`app/globals.css` holds exactly two things: `@import "tailwindcss";` and the `@theme`
tokens. Nothing else goes in it — no component classes, no element selectors, no
`@apply`, no `@font-face` (use `next/font`), no typography plugin.

Markdown output is styled by passing a `components` map to `react-markdown` that puts
Tailwind classes on each element. That is how prose gets styled here — not with a
global `.prose` class. If something truly cannot be done without global CSS, stop and ask.

## Content is locked

* Words in `content/` are approved. Never reword, shorten, merge, retitle or "tighten"
them, and never correct spelling inside a review.
* Sections marked `@status: held` are not rendered. Do not fill them, do not stub them.
* Before writing ANY text not already in `content/` — alt text, aria-labels, meta tags,
button labels, 404 copy, nav labels — read `docs/copy-rules.md`.

## Hard prohibitions

Breaking any of these is a defect, not a style choice.

* **Implants do not exist on this site.** No page, nav item, service entry, schema entry,
link or mention. **Veneers are not offered** — never list them.
* **Never "painless" or "pain-free"**, anywhere, including alt text and metadata.
* **Dr Abaid Khalil is a dentist who provides orthodontic treatment.** Never "orthodontist",
never "specialist". Always "Dr Abaid Khalil, BDS, C.Orth" where credentials appear.
* **No star ratings or review counts anywhere**, including JSON-LD: no `aggregateRating`,
no `review` nodes. Never render a rating next to a review. One exception, approved by
Uzair on 24 Sep 2026: the overall Google rating (★ 4.7/5) on the Dr Abaid card
(`GOOGLE_RATING` in `Website/components/brand/DoctorSection.tsx`). It is never shown next to a
review or with a count, and never goes in the JSON-LD.
* **No success rates or outcome percentages** for any treatment.
* **Nav, footer and sitemap come from `content/\_global.md` only.** Never add a page or
service because a dental site "usually" has one.
* **Never build a section around an image that isn't in `/public/images/`.** Five kinds of
real photo exist: portraits of Dr Abaid, clinic interiors, one exterior shot, consented
before/afters, and one treatment-in-process photo of Dr Abaid treating a patient
(`Treatment in process/`, used via `@visual: treatment`). The only other imagery is the
generated site set in `Public/Images/Site/` (heroes, treatment cards, and pictures for the
inner pages' sections), added at the owner's request: ultra-realistic, made with the Magnific
MCP (Nano Banana Pro). A generated picture never shows a dentist's face (gloved hands or a
back only), never shows staff or a second clinician, and never shows implants, veneers or
framed certificates. No stock photography. No placeholder boxes.
A `before-after` section with no images in its folder is omitted entirely.
* **The clinic's shop sign lists "C.Implant".** Crop the exterior photograph so the sign is
never legible (Contact keeps to the shopfront below it).

## Decided since the brief

* **FAQs (`@type: faq`) render as an accordion** — native `<details>`, first item open, so
every answer stays in the HTML. Standalone question sections (e.g. teeth-cleaning's
"Does it damage the enamel?") are ordinary sections and stay open.
* Other deliberate departures from the content (hidden sections, the Dr Abaid stat cards)
are commented where they happen in `Website/components/`.
* **Design (from 24 Sep 2026): the brand refresh, on every page.** Urbanist, Warm White
ground, Care Teal, Deep Teal and Coral; after the "ClearDent" reference. Home is
`components/brand/HomePage.tsx`; every other page is `components/brand/page/ContentPage.tsx`,
and which layout each section gets (steps, compare, cost panel, checklist…) and its pictures
are set in `components/brand/page/layouts.ts`. Layouts arrange a section's own paragraphs in
their own order; they never change a word. White text only on Deep Teal.

## WhatsApp

Primary action on every page. Link is `https://wa.me/923126617939` — **nothing pre-filled.**
Do not add a `?text=` parameter. The patient writes their own message.
Secondary action on every page: call, `tel:+923126617939`. No booking form, ever.

## Layout priority

Mobile first. Dr Abaid sends the site as a link over WhatsApp, so most visits are a phone
opening a link. Location, hours and the WhatsApp button come before any argument.
The WhatsApp button is always reachable without scrolling on a 360px viewport.

## Pointers — read only when the task needs it

|File|Read when|
|-|-|
|`docs/content-format.md`|Building or changing the content parser or section components|
|`docs/copy-rules.md`|Writing any text not already in `content/`|
|||
|||
|`content/\_global.md`|Header, footer, nav, contact details, hours, schema|
|`content/reviews.md`|Rendering any `@reviews:` reference|
|`content/<slug>.md`|Building that page|

## Commands

Run from `Website/`. `npm run …` runs the same scripts where `pnpm` itself is blocked.

```
pnpm dev
pnpm build      # static export to ./out, then runs the copy check
pnpm lint
```

