# Verification, 20 October 2026

Run on Linux with Node.js 22.22, Next.js 16, Playwright 1.64 and Chromium. No API key was
set and no live model was called. This run was done after the B2B redesign.

| Check | Result |
|---|---|
| TypeScript | `npm run typecheck` passed |
| Engine, edge cases and connector | `npm test`: 41 tests passed across 4 files |
| Production build | `npm run build` passed, all app and API routes compiled |
| Browser workflows | 3 Playwright workflow tests passed against the production build on port 3001 |
| Demo recording | Rebuilt from real browser frames of the same demo steps (see below) |
| Dependencies | `npm install` reported 0 vulnerabilities |
| Licenses | 186 installed packages checked, 0 missing licenses |
| Visual check | Desktop home, desktop workspace and mobile workspace screenshots reviewed |

The browser tests cover the live capital slider on the home page, creating and importing,
picking a path, instant ownership changes, reloading saved data, JSON contents, CSV row
count, the PNG file signature, a full share link round trip via the clipboard, reset to
baseline, the no-key error, no sideways scrolling on mobile, and the AI suggestion review.

About the recording: in this sandbox, Playwright's built-in video recorder didn't produce
a file (the installed Chromium build and Playwright version didn't match). So the
`docs/media` videos were made by running the same steps as `tests/e2e/demo.spec.ts`
against the real app, saving a frame after each step, and stitching them with FFmpeg.
Nothing is faked. On a normal machine with `npx playwright install chromium`, the demo
test records the WebM by itself.

Integration tests hit the official SDK interface through labeled mocks: structured JSON
config, the cache on disk, one fix-up retry, a limited 429 retry, input and consent checks,
localhost origin handling, request caps that survive restarts, and budget access from
several processes at once. These aren't live provider results.

The engine's hand calculated sample outputs are checked against `fixtures/golden.json`.
Tests cover zero revenue and burn, negative growth, zero starting cash, funding in months
1 and 24, 0 and 100% gross margin, 100% churn, capex, hiring, dilution, missing valuation,
supported outliers, baseline inheritance, sensitivity and repeatable fingerprints.

Not checked: live Gemini output or real free tier eligibility, browsers other than
Chromium, multi-host public deployments, or real business outcomes. The optional
Sharp/libvips packages carry LGPL obligations if you redistribute their binaries. This repo
doesn't bundle those binaries.
