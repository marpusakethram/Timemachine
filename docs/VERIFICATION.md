# Verification — 20 October 2026

Tested locally on Windows with Node.js 22.22.2, npm 10.9.7, Next.js 16.4.2
and Playwright Chromium. No API key was configured and no live model call was made.

| Gate | Result |
|---|---|
| TypeScript | `npm run typecheck` passed |
| Deterministic engine / boundaries / connector | `npm test`: 41 tests passed across 4 files |
| Production build | `npm run build` passed; all app and API routes compiled |
| Browser workflows | `npm run test:e2e`: 4 tests passed against production on port 3001 |
| Dependencies | npm audit reported 0 vulnerabilities after upgrading Vitest |
| Licenses | 177 installed package manifests inspected; 0 missing declarations |
| Visual review | Desktop home, desktop workspace, mobile workspace and architecture PNG inspected |

Browser checks cover the home-page live capital slider, create and import, branch
selection, immediate ownership changes, saved reload, JSON contents, CSV row count,
PNG signature, clipboard share round trip, reset to baseline, no-key error,
mobile overflow and inferred-candidate review. A separate test records the
slider transformation using the real application.

Integration tests exercise the official SDK interface through labeled mocks:
structured JSON configuration, durable cache, one corrective retry, bounded 429
retry, input/consent checks, normalized localhost origin handling, persistent
request caps and concurrent budget access. These are not live provider results.

The engine's hand-calculated sample outputs are checked against
`fixtures/golden.json`. Tests cover zero revenue/burn, negative growth,
zero starting cash, financing at months 1 and 24, 0/100% gross margin,
100% churn, capex, hiring, dilution, missing valuation, supported outliers,
baseline inheritance, sensitivity and deterministic fingerprints.

The first browser runs identified test selector/compilation timing issues and a
real localhost-origin mismatch in the API route. Those were corrected before the
passing production run. The final browser suite uses its own port so the live
preview can remain running.

Not verified: live Gemini output or real free-tier account eligibility, other browser
engines, multi-host public deployments, or real-world business outcomes. Optional
Sharp/libvips packages have LGPL obligations if their binaries are redistributed;
this source repository does not bundle those binaries.
