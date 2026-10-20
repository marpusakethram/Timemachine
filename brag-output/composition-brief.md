# Hyperframes Composition Brief: Time Machine

## Objective
A short, polished launch video for Time Machine.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape, 1920x1080
- Duration: 21 seconds

## Source Material
- Project root: repository root
- Primary files read: `components/decision-preview.tsx`, `components/decision-input.tsx`,
  `components/scenario-comparison.tsx`, `app/globals.css`, `README.md`, `docs/DESIGN.md`
- Product name: Time Machine
- Tagline: "Don't guess. Move the assumptions."
- Key UI to recreate: the home page live model panel and the workspace path comparison cards
- Copy that must appear verbatim:
  - Don't guess. Move the assumptions.
  - Founder ownership / Modeled runway / Capital raised
  - Bootstrap conservatively / Hire two engineers / Raise $200k

## Creative Direction
- Tone preset: polished; calm B2B finance product film
- Hook: giant 100% founder ownership
- Outro: TM logo lock-up and the GitHub address
- Avoid: generic SaaS language, abstract filler, any look that isn't the app's

## Visual Identity
- Background #f3f4f1, panel #fbfbf9, text #15191f, muted #47505c, accent #2f4bd8
- Path colors #2a9d8a, #c9822b, #4d6bff
- Fonts: Schibsted Grotesk (display), IBM Plex Sans (UI), shipped as local woff2

## Audio
- Music: `assets/music/bed.mp3` (vol-10, 110 BPM), fade in/out
- SFX: reveal.ogg (logo reveal), click.ogg (drag), card.ogg (each path card), logo.ogg (outro)
- Beat-locked: outro logo at 18.55s. Beat grid for cards at 14.20, 15.28, 16.38.
- Audio-reactive: subtle accent glow driven by bass, if extraction works

## Hyperframes Instructions
Build with hyperframes-core rules: one paused GSAP timeline at `window.__timelines["main"]`,
local GSAP and fonts, every audio element with an id, `check` must pass before render.
