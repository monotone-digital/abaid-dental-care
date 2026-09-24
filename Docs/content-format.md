# Content format

How `content/*.md` is structured, so the parser and section components can be built once.

## Files

- `_global.md` — clinic details, nav, hours, links, schema rules. YAML frontmatter only.
- `reviews.md` — every patient review, verbatim, with an id. YAML frontmatter only.
- `<slug>.md` — one per page. Frontmatter + sections.

Files starting with `_` are not pages.

## Page frontmatter

```yaml
title: Caps and bridges          # page name, used in nav and breadcrumbs
slug: caps-and-bridges           # "" for home
order: 4                         # nav order
metaTitle: ...                   # approved, use verbatim
metaDescription: ...             # approved, use verbatim
ctaLabel: Message us about a cap # label for every WhatsApp button on this page
ogTitle: ...                     # optional; only where copy set a link preview
ogDescription: ...               # optional
```

`ctaLabel` is the WhatsApp button label everywhere on that page, including the sticky bar.

## Sections

Each `## ` heading starts a section. The heading text is the section headline, verbatim.
Immediately under it, before the first blank line, come directive lines `@key: value`.
Everything after that blank line is the section body, in markdown.

```md
## What it costs
@id: cost
@sub: From PKR 5,000.
@visual: none

What it comes to depends on the material...
```

### Directives

| Directive | Meaning |
|---|---|
| `@id` | Anchor id. Required. `hero` is always the first section |
| `@sub` | Subheadline, verbatim. Load-bearing where present — never drop it or move it below the buttons |
| `@type` | Section component. Default `text`. See below |
| `@cta` | `whatsapp` renders the WhatsApp button with the page `ctaLabel` |
| `@call` | `yes` renders the call button, label `Call 0312 6617939` |
| `@beside` | Small line rendered next to the buttons |
| `@link` | `/path \| Label` — a text link. Label verbatim |
| `@maps` | Label for a button to the Google Maps URL in `_global.md` |
| `@visual` | `portrait`, `interior`, `exterior`, `treatment` (the "Treatment in process" photo), `before-after`, `map`, or `none` |
| `@reviews` | Comma-separated review ids from `reviews.md` |
| `@status` | `held` — do not render this section at all |
| `@note` | Build instruction. **Never rendered** |

### Section types

| `@type` | Renders |
|---|---|
| `text` | Headline, optional sub, markdown body, actions, optional visual |
| `clinic-card` | Home hero part one. Body is the address; then the today's-hours line (below); then buttons |
| `faq` | Each `### ` is a question; the paragraphs under it are the answer. Rendered as an accordion (native `<details>`, first item open), so every answer stays in the HTML |
| `signpost` | Body is a list of `[**Label.** text](#anchor)` items; render as large tappable blocks |
| `reviews` | Renders the referenced reviews as quotes with attribution. No stars, ever |
| `before-after` | Images from `/public/images/before-after/<slug>/`. **If the folder is empty or missing, omit the section entirely**, heading included |
| `map` | Body + the embedded map from `_global.md`. Lazy-load the iframe |

### Today's hours

Used by `clinic-card`, and optionally on Contact.

- Server-rendered HTML shows the static fallback from `_global.md` (`hours.fallback`).
- A small client component replaces it after hydration with `hours.todayLabel` + the value
  for today's weekday, computed in **Asia/Karachi** time with `Intl.DateTimeFormat`,
  not the visitor's device time zone.
- **Never ship a fixed hours string here.** It is false on Friday mornings and all Sunday.

### Markdown in bodies

GFM: bold, links, lists, tables, blockquotes. Tables are used for hours and prices —
render them as real tables, readable at 360px without horizontal page scroll.
Internal links are site-relative (`/root-canal`).

## Rendering rules

- One `<h1>` per page: the hero headline. Section headlines are `<h2>`, FAQ questions `<h3>`.
- Nothing from `@note` or from HTML comments reaches the output.
- Drop `@status: held` sections first. Then, if any remaining section, frontmatter value or
  `_global.md` value that reaches a page contains `[NEEDS:`, fail the build.
- A trailing `\` in a body line is a hard line break (GFM). Used for the Contact address.
