# Design direction

The brief: make it modern, use Meta's website as the reference, and don't let it look
machine-made. (marvi.app was also named, but this build environment couldn't reach it, so
nothing here copies from it.)

## What we took from Meta

White canvas, big confident sans headlines, huge rounded image tiles on a light grey
"mist" background, and dark ink pill buttons. Product imagery does the selling, not
illustrations.

## What makes it ours

- **The path colors are the brand.** There's no single accent color. Sky, marigold and mint
  are the three futures (paths A, B and C), and the logo is those three lines leaving one
  point. Those colors only ever mean "which path." They never mean better or worse.
- **Real screenshots everywhere.** The hero and the "inside the app" mosaic use real captures
  from `tests/e2e/screens.spec.ts`. A working capital slider floats over the hero shot and
  runs the real engine.
- **One family, used with intent.** Mona Sans variable. Headlines use its wide axis (118%)
  so they read bold and modern without needing a second typeface. Body text stays at normal
  width. All numbers are tabular so columns line up.

## Tokens

| Token | Value | Used for |
|---|---|---|
| Paper | `#FFFFFF` | Page and cards |
| Mist | `#F0F2F5` | Tiles, KPI strip, segmented controls |
| Ink | `#1C2A33` | Text and primary buttons |
| Slate | `#586773` | Secondary text |
| Line | `#DBE0E6` | Borders |
| Sky | `#2E6BE6` | Path A, focus rings |
| Marigold | `#E39A0B` | Path B |
| Mint | `#0E9F74` | Path C, live indicator |
| Red | `#D2423B` | Negative cash, short runway |

Corner radius follows hierarchy: pills for buttons, 32px for big tiles, 20px for cards,
12px for inputs.

## What we deliberately left out

Things that make a page look generated: little labels above every heading, "01 / 02 / 03"
numbering on things that aren't steps (paths are A, B, C instead), arrows tacked onto
button text, "A · B · C" strings, identical shadowed cards everywhere, and fade-in effects
on every section. The only ambient motion is the small breathing dot on the live widget,
and it switches off with reduced motion.

## Layout

```
[mark Time Machine]   Inside the app  New decision  Your decisions  GitHub   (Try the demo)

            Hire, raise or stay lean. See the next 24 months first.
                         short lead, two pill buttons
 ┌───────────────────────────── mist tile ─────────────────────────────┐
 │ ┌ live slider ┐   ┌──────── real workspace screenshot ────────────┐ │
 │ └─────────────┘   └───────────────────────────────────────────────┘ │
 └─────────────────────────────────────────────────────────────────────┘
 ┌──── compare paths (wide) ────┐ ┌ phone (tall, ink) ┐
 ├ assumptions ┬ stress test ───┤ │                   │
 new decision form + privacy notes        your decisions table        footer
```

The workspace is an app shell: sticky header with breadcrumb and Save, title with export
pills, a pill path switcher, the KPI strip, then assumptions, charts and the path brief in
three columns. It drops to two columns, then one on phones.
