# Architecture

The architecture diagram is original and follows the layered style the project owner
asked for. Its source is `scripts/create-architecture.mjs`, which writes an SVG that
GitHub shows directly. The PNG is just a browser rendered copy.

## Pages and where data lives

`app/page.tsx` opens the home page and workbench. `app/scenario/[id]/page.tsx` opens a
saved scenario from this browser by its UUID. Both render client components. There's no
server side scenario database and no fake "persistence" API. Each browser owns its own data.

`lib/simulation/models.ts` holds the versioned Zod contract: Decision, Baseline, Branch,
Assumption, Event, MonthlySnapshot, SimulationResult, UncertaintyLabel, Citation and
ModelVersion. A decision needs exactly three branches, each with a unique ID. Importing
strips unknown keys, checks number limits and requires a source tag on every override.
Saving locally runs the same validator, so bad data never replaces what's in storage.

`lib/simulation/engine.ts` layers each branch's overrides on top of the baseline and
works out 24 monthly snapshots. It has no React, network or file access. Math runs on
plain JavaScript numbers with no rounding along the way. Only the UI formats currency.
A stable, non-cryptographic fingerprint identifies the inputs. It's an ID, not a
security check. You can pass in the timestamp, so tests with fixed inputs reproduce the
whole result exactly.

`lib/simulation/sensitivity.ts` reruns the model over fixed growth and expense grids.
The UI memoizes each branch's values, so the KPI strip, cash chart, comparison cards and
path brief all read from the same results. AI output is never trusted as a calculation.

## UI layout

The home page (`components/decision-input.tsx`) has a sticky header, a hero with a live
preview card, a stats band, a "how it works" section, the new decision form, and the
workbench table of saved scenarios.

The workspace (`components/workspace.tsx`) is an app shell: a sticky header with a
breadcrumb and Save, a page header with export buttons, a path switcher, a KPI strip,
then a three column grid with assumptions on the left, charts and comparisons in the
middle, and the path brief on the right. Shared tokens and styles live in `app/globals.css`.

## Optional AI

Only `POST /api/scenarios/generate` talks to Gemini. It takes a cleaned up title,
description and a bounded baseline, plus explicit consent. It rejects oversized bodies
and cross-origin calls. No file uploads and no raw credentials go out.

`lib/ai/gemini.ts` needs an exact model ID, a recently checked allowlist, and confirmation
that the project is unbilled. It keeps a daily budget on disk (UTC days), uses a disk lock
that works across processes, and enforces a per-run cap, a timeout, input and output caps,
and limited retries with backoff. A SHA-256 cache skips repeat requests. Logs only hold
model metadata. Raw provider errors never get sent back to the browser.

Suggestions get parsed, stripped and bounded. Extreme values need an explanation. You
review suggestions before they apply, and numbers you entered yourself always win.
"Narrative only" keeps every number as is. There's no made up confidence score, no
AI generated citations and no running generated code.

## Storage and exports

Browser `localStorage` holds up to 50 validated scenarios. JSON is the full portable copy.
CSV is the 24 monthly rows for the selected path. PNG captures the visible workspace. A
size limited hash link carries a scenario, with a clear warning about who can read it.
Importing a file or opening a link always creates a fresh UUID, so it never overwrites an
existing scenario.

The server's `.data` folder only holds AI request counts and the suggestion cache. It's not
a user database. There are no accounts, billing, bank or cloud storage flows.

## Shipping it

The repo includes the lockfile, sample data, tests, screenshots, diagram and docs. People
install with `npm ci`. CI runs the typecheck, Vitest, the production build and Playwright,
all without an API key. You don't need paid hosting. A public deployment with Gemini turned
on needs access control and a durable shared quota store.
