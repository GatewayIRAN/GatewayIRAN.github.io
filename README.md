<div align="center">

<img src="assets/mark.svg" alt="GatewayIRAN" width="88">

### gatewayiran.github.io

**The source of the account's front page.**

[![Live](https://img.shields.io/badge/live-gatewayiran.github.io-17A34A?style=for-the-badge&labelColor=0D1117)](https://gatewayiran.github.io)
[![License](https://img.shields.io/badge/license-Apache--2.0-2A44B4?style=for-the-badge&labelColor=0D1117)](LICENSE)
[![Requests](https://img.shields.io/badge/third--party%20requests-0-17A34A?style=for-the-badge&labelColor=0D1117)](#no-third-party-requests)

</div>

<br>

## What is here

One page, hand-written, no build step. Open `index.html` in a browser and what
you see is what ships.

```
index.html            the page
assets/style.css      design tokens and layout
assets/app.js         progressive enhancement only
assets/fonts/         the typefaces, served from this repository
assets/*.svg          logo mark and the animated flow diagram
.nojekyll             skip Jekyll; nothing here needs preprocessing
```

<br>

## No third-party requests

The page loads its own fonts from `assets/fonts/`. There is no content delivery
network, no analytics tag, no embedded widget, and no font service. Open the
network panel and count: every request goes to this origin.

That is not a performance claim. It means nobody learns your address because you
read this page.

<br>

## How the motion is built

> [!IMPORTANT]
> Nothing that carries meaning is animated into existence. Every element is
> styled at its resting, visible state; motion is added on top.

Concretely:

- The scroll reveal hides content **only after** scripting has armed it and
  scheduled a timer to disarm it. Block `app.js`, break
  `IntersectionObserver`, or load the page in a reader — the content is simply
  there.
- `prefers-reduced-motion: reduce` collapses every animation and transition, and
  disables the reveal entirely.
- The flow diagram ships as two SVG files, one per theme, each fully composed
  with animation disabled. Renderers that ignore CSS animation inside an image
  still get the finished diagram.

<br>

## Local preview

No toolchain, no dependencies. Any static file server will do:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly from the
filesystem also works, though the font preloads are noisier in the console.

<br>

## Editing

- **Colour, spacing, radius, easing** — the token block at the top of
  `assets/style.css`. Change a token, not a rule.
- **Both themes.** `:root` carries the dark values and
  `:root[data-theme=light]` overrides them. A new colour needs an entry in
  both.
- **Content** lives in `index.html` as plain markup. There is no template
  language to learn.

<br>

## Deployment

Pushing to `main` publishes. GitHub Pages serves this repository at the account
root; `.nojekyll` keeps it from running content through Jekyll first.

<br>

<div align="center">
<img src="assets/rule.svg" alt="" width="100%">
<sub>Apache-2.0 · No trackers · Maintained by <a href="https://github.com/MrAryanMiri">@MrAryanMiri</a></sub>
</div>
