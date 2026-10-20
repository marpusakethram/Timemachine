# Verification (20 October 2026)

Tested on Linux with Node.js 22.22.0, Next.js 16.4.2 and Playwright 1.64 driving
Chromium. No API key was set and no live model was called.

| Check | Result |
|---|---|
| TypeScript | `npm run typecheck` passed |
| Engine, edge cases and AI connector | `npm test`: 41 tests passed across 4 files |
| Production build | `npm run build` passed and every page and API route compiled |
| Browser workflows | 3 of 3 workflow tests passed against the production build on port 3001 |
| Demo recording test | All of its app checks passed, but saving the video failed because this machine's Playwright and FFmpeg versions didn't match. The videos were remade from frame captures instead (see [DEMO.md](DEMO.md)) |
| Dependencies | `npm audit` found 0 vulnerabilities |
| Licenses | 187 installed packages checked, 0 missing a license |
| Visual review | Home and workspace checked in light mode, dark mode and at phone width (390px, no sideways scrolling) |

What the browser tests cover: the live capital slider on the home page, creating and
importing decisions, switching paths, ownership updating instantly, saving and
reloading, the JSON contents, the CSV row count, the PNG file signature, a share link
round trip through the clipboard, resetting a path to the baseline, the "no key"
error, mobile overflow, and the AI review flow.

The integration tests hit the official SDK interface through labeled mocks: JSON
output settings, the lasting cache, one fix-up retry, capped 429 retries, input and
consent checks, localhost origin handling, request caps that survive restarts, and
budget access from several processes at once. These are not live results from Google.

The engine's hand-worked sample numbers are checked against `fixtures/golden.json`.
Tests also cover zero revenue or burn, negative growth, starting with zero cash,
funding in months 1 and 24, 0% and 100% margin, 100% churn, one-time spend, hiring,
dilution, missing valuation, supported extreme values, baseline inheritance,
sensitivity and repeatable fingerprints.

Not verified: real Gemini output or real free-tier eligibility, browsers other than
Chromium, multi-server public deployments, and real-world business results.
Optional Sharp/libvips packages carry LGPL terms if you redistribute their binaries.
This repo doesn't bundle those binaries.
