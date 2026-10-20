# Build gates

A box is only ticked when the thing was actually run or checked. Anything that couldn't be
verified in this environment is called out on its own line.

## 1. Inspect before changing
- [x] Toolchain recorded: Node 22.22, npm 10.9, Next.js 16.4.2, React 19.3, TypeScript 5.9,
      Vitest 5.0, Playwright 1.64, Tailwind 4.3, Zod 4.6, @google/genai 1.52
- [x] Read the Next.js 16 docs bundled in `node_modules/next/dist/docs` before adding ESLint
      (`next lint` is gone in v16, so lint runs through the ESLint CLI)

## 2. Scope (MVP only)
- [x] One decision with exactly three paths: bootstrap, hire, raise
- [x] 24 month deterministic cash, runway and ownership model
- [x] Local browser storage, JSON / CSV / PNG export, share links
- [x] Optional Gemini suggestions, off by default
- [x] Nothing outside that list (no accounts, sync, payments or extra templates)

## 3. Scaffold and health
- [x] `npm ci` installs cleanly
- [x] `npm run dev` and `npm start` serve the app on 127.0.0.1
- [x] `npm run build` compiles every route

## 4. Deterministic core, tested before any AI
- [x] Pure engine in `lib/simulation/engine.ts` with no React, network or file access
- [x] Hand calculated golden months in `fixtures/golden.json`
- [x] Edge cases: zero revenue, negative growth, zero cash, 0 and 100% margin and churn,
      funding in months 1 and 24, capex, hiring, unknown valuation
- [x] Sensitivity grid and stable input fingerprints

## 5. Gemini, server only
- [x] Only `POST /api/scenarios/generate` calls Gemini; the key never reaches the browser
- [x] Exact free model allowlist with an operator check date that expires after 30 days
- [x] Daily and per-run budget caps stored on disk with a cross-process lock
- [x] SHA-256 response cache, input and output caps, timeout, limited retries
- [x] Explicit consent and a review step before anything is applied
- [ ] **Not verified live.** No key was available here. The connector is tested with
      labeled fixtures and the real "not configured" error path only

## 6. Flagship flow with the local sample
- [x] Open the fictional SaaS demo, pick Raise $200k, move capital from 200k to 400k,
      ownership goes from 83.3% to 71.4%, save, reload, export

## 7. Accessible, responsive UI with real behavior
- [x] Every visible button does something real (no dead links or placeholder actions)
- [x] Keyboard focus rings, labeled inputs, reduced motion respected
- [x] No sideways scrolling at 390px wide (checked by a browser test)
- [x] Marketing page uses real screenshots captured by `tests/e2e/screens.spec.ts`

## 8. Checks
- [x] `npm run typecheck`
- [x] `npm run lint` (ESLint 9 with `eslint-config-next`)
- [x] `npm test` (unit and integration)
- [x] `npm run test:e2e` workflow and screenshot tests
- [ ] **Demo video test** (`tests/e2e/demo.spec.ts`) can't record in this sandbox because the
      installed Chromium doesn't match Playwright 1.64. It should run in CI, which installs
      its own browser. The committed videos were built from real frames of the same steps.

## 9. Docs and config
- [x] README with exact commands, screenshots, failure modes and scope limits
- [x] `.env.example` with empty values only; no keys anywhere in the repo
- [x] Third-party license list regenerated

## 10. Known open items
- [ ] `npm audit` flags `braces` through `eslint-config-next` (dev only, lint time). There is
      no patched `braces` release yet, and npm's suggested fix downgrades to the Next 14
      lint config, so it's left as is and tracked here.
