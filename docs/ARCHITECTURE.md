# Architecture

The diagram is original and follows a layered layout. Its source is
`scripts/create-architecture.mjs`, which writes an SVG that GitHub shows directly.
The PNG is a browser render of that same SVG.

## Pages and where data lives

`app/page.tsx` is the home page and workbench. `app/scenario/[id]/page.tsx` opens a
saved scenario by its ID from your browser. Both render client components. There's
no server database and no fake "save to server" API. Each browser owns its own data.

`lib/simulation/models.ts` holds the versioned Zod schema: Decision, Baseline,
Branch, Assumption, Event, MonthlySnapshot, SimulationResult, UncertaintyLabel,
Citation and ModelVersion. A decision has exactly three paths, each with its own ID.
Imports drop unknown fields, check number ranges and require a source for every
override. Saving uses the same checks, so bad data never replaces what's stored.

`lib/simulation/engine.ts` layers each path's overrides on top of the baseline and
works out 24 monthly snapshots. It doesn't use React, the network or the disk.
Math runs on normal JavaScript numbers with no rounding along the way. Only the UI
formats currency. A simple (not cryptographic) fingerprint identifies the inputs.
The timestamp can be injected, so tests with fixed inputs get the exact same result.

`lib/simulation/sensitivity.ts` reruns the engine across a grid of growth and
expense values. The UI reuses the same results for the charts, comparison cards and
evidence panel. Nothing an AI suggests is ever trusted as a calculation.

## Optional AI

Only `POST /api/scenarios/generate` talks to Gemini. It takes a cleaned up title,
description and capped baseline, plus your explicit consent. It rejects oversized
requests and calls from other sites. No files or credentials get sent.

`lib/ai/gemini.ts` needs an exact model name, a recently verified allowlist and a
confirmation that the project has no billing. It keeps a daily budget on disk (UTC),
uses a disk lock that works across processes, and caps each run, timeouts, input
size, output size and retries. A SHA-256 cache skips repeat requests. Logs only hold
model info. Raw errors from the provider are never shown to users.

AI suggestions are parsed, trimmed and capped, and extreme values need an
explanation. You review them before they apply. Numbers you typed yourself always
win. "Narrative only" mode keeps every number as is. There's no made-up confidence
score, no AI-written citation and no running of generated code.

## Storage and exports

Browser `localStorage` holds up to 50 validated scenarios. JSON is the full,
portable copy. CSV is the 24 monthly rows for the selected path. PNG captures the
visible workspace. Share links pack a small scenario into the URL, with a warning
that anyone with the link can read it. Importing a file or opening a link always
makes a new ID, so it never overwrites something you already have.

The server's `.data` folder only stores AI request counts and cached suggestions.
It's not a user database. There are no accounts, billing, bank links or cloud saves.

## Shipping it

The repo includes the lockfile, sample data, tests, screenshots, diagram and docs.
People install with `npm ci`. CI runs the typecheck, Vitest, the production build and
Playwright, all without an API key. No paid hosting is needed. A public deployment
with Gemini turned on needs access control and a shared, lasting quota store.
