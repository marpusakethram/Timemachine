# Verification, 20 October 2026

Run on Linux with Node.js 22.22, npm 10.9, Next.js 16.4.2, Playwright 1.64.1 and Chromium,
after the Meta style redesign. No API key was set and no live model was called.

| Check | Command | Result |
|---|---|---|
| TypeScript | `npm run typecheck` | Passed |
| Lint | `npm run lint` | Passed, 0 errors, 0 warnings |
| Unit and integration | `npm test` | 41 tests passed across 4 files |
| Production build | `npm run build` | Passed, all app and API routes compiled |
| Browser workflows | `npm run test:e2e` | 4 passed: 3 workflow tests and the screenshot capture |
| Demo recording | `tests/e2e/demo.spec.ts` | Every click and assertion passed. Saving the video failed (see below) |
| Licenses | `node scripts/audit-licenses.mjs` | 493 packages, 0 missing licenses |
| npm audit | `npm audit` | 5 high, all one issue: `braces` inside `eslint-config-next` (see below) |
| Visual check | | Desktop home, desktop workspace and mobile workspace screenshots reviewed |

## What the browser tests cover

The live capital slider on the home page, creating a decision, a bad JSON import, importing
the sample fixture, picking path C, ownership going from 83.3% to 71.4%, save and reload,
JSON contents, CSV row count, the PNG file signature, a full share link round trip through
the clipboard, reset to baseline, the "Gemini is not configured" error, no sideways scrolling
at 390px, and the AI review step using a labeled test fixture.

`tests/e2e/screens.spec.ts` drives the real app and saves the marketing screenshots in
`public/screens`. The home, workspace and mobile shots in `docs/screenshots` come from
`tests/e2e/workflow.spec.ts`.

## The demo video

In this sandbox, the installed Chromium build doesn't match Playwright 1.64, so Playwright's
video recorder never writes a file. The demo test still runs every step and passes every
assertion, then fails at `video.saveAs`. The videos in `docs/media` were made by running the
same steps against the real app, saving a frame after each step, and joining them with
FFmpeg. Nothing is mocked. CI installs a matching browser with `npx playwright install`, so
the test should record on its own there. That wasn't confirmed from here.

## The npm audit finding

`braces` (pulled in by `eslint-config-next` through `fast-glob` and `micromatch`) is flagged
for a stack exhaustion bug with deeply nested patterns. It only runs at lint time on our own
config globs and never ships to users. No patched `braces` release exists yet, and npm's
`--force` fix downgrades to the Next 14 lint config, which doesn't fit Next 16. Left as is
and tracked in `TODO.md`.

## Integration tests

These hit the official SDK interface through labeled mocks: structured JSON config, the disk
cache, one fix-up retry, a limited 429 retry, input and consent checks, localhost origin
handling, request caps that survive restarts, and budget access from several processes at
once. These are not live provider results.

The engine's hand calculated outputs are checked against `fixtures/golden.json`. Tests cover
zero revenue and burn, negative growth, zero starting cash, funding in months 1 and 24, 0 and
100% gross margin, 100% churn, capex, hiring, dilution, missing valuation, outliers, baseline
inheritance, sensitivity and repeatable fingerprints.

## Not verified

- Live Gemini output, or whether any real model is on the free tier right now.
- Browsers other than Chromium.
- Public, multi-host deployments.
- Any real business outcome.
