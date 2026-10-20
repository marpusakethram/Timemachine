# Architecture

The architecture diagram is original, based on the layered visual format supplied
by the user. The source is `scripts/create-architecture.mjs`; it generates an SVG
that GitHub displays directly. The PNG is a browser-rendered copy.

## Request and state boundaries

`app/page.tsx` opens the workbench. `app/scenario/[id]/page.tsx` opens the browser's
saved scenario by UUID. Both render client components; there is no server-side
scenario database or misleading persistence API. Each browser owns its data.

`lib/simulation/models.ts` defines the versioned Zod contract: Decision, Baseline,
Branch, Assumption, Event, MonthlySnapshot, SimulationResult, UncertaintyLabel,
Citation and ModelVersion. A decision must have exactly three uniquely identified
branches. Import strips unknown keys, validates numeric bounds and requires override
provenance. Local save uses the same validator. Invalid data never replaces storage.

`lib/simulation/engine.ts` resolves branch overrides over baseline and computes
24 monthly snapshots. It has no React, network or I/O dependency. Calculations use
JavaScript doubles without intermediate rounding; presentation formats currency.
A stable non-cryptographic fingerprint identifies engine inputs, not authenticity.
The timestamp is injectable so fixed-input tests reproduce the whole result.

`lib/simulation/sensitivity.ts` recomputes deterministic growth and expense grids.
The UI uses memoized branch values to update cash charts, comparison cards and evidence
from the same results. No AI-generated financial output is trusted as a calculation.

## Optional AI

Only `POST /api/scenarios/generate` contacts Gemini. It accepts a sanitized title,
description and bounded baseline, plus explicit consent. It rejects oversized bodies
and cross-origin calls. No file uploads or raw credentials are included.

`lib/ai/gemini.ts` requires an explicit exact model, a recently operator-verified
allowlist and confirmation of an unbilled project. It has a persistent UTC-day budget,
process-independent disk lock, per-run cap, timeout, input/output caps and bounded
retry/backoff. A SHA-256 cache avoids repeated deterministic requests. Logs contain
model metadata only. Raw provider errors are not reflected to clients.

Candidate outputs are parsed, stripped and bounded; extreme values require explanations.
The user reviews candidates before application. Entered branch values take priority.
Narrative-only regeneration preserves all numbers. There is no inferred confidence
score, model-generated citation or execution of generated code.

## Storage and exports

Browser `localStorage` holds up to 50 validated scenarios. JSON is the full portable
artifact; CSV is 24 numeric rows for the selected branch; PNG captures the visible
model workspace. A size-bounded hash link carries a scenario with an explicit
disclosure warning. Import and link opening create a fresh UUID to avoid overwriting
an existing scenario.

The server's `.data` directory holds only AI request counts and candidate cache.
It is not a user database. There are no account, billing, bank or cloud persistence flows.

## Distribution

The repository contains the lockfile, sample, tests, screenshots, diagram and docs.
Users install with `npm ci`. CI runs typechecking, Vitest, the production build and
Playwright with no API key. No paid hosting is required. Public deployments with
Gemini enabled require additional access control and durable shared quota storage.
