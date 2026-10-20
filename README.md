# Time Machine

**Don't ask what happens. Move the assumptions.**

A local-first startup decision lab: frame a dilemma, select one of three branches,
move a capital or growth slider, and see runway and ownership recalculate.
These are conditional models, not forecasts or investment recommendations.

![Time Machine live decision preview](docs/screenshots/home.png)

## Run it

Requires **Node.js 22.12+** and npm. No account, API key, paid service or database needed.

```sh
git clone https://github.com/marpusakethram/Timemachine.git
cd Timemachine
npm ci
npm run dev
```

Open **http://127.0.0.1:3000** and choose **Open the fictional SaaS demo**.
After dependencies are installed, the flagship interaction takes less than a minute:

1. Select **Raise $200k**.
2. Move **Capital raised** from 200,000 to 400,000.
3. Watch the cash curve rise and founder ownership change from **83.3% to 71.4%**.
4. Compare the bootstrap and hiring paths, then export JSON or CSV.

The demo performs no cloud calls. Save writes to this browser's localStorage.
Export JSON for backups or to move a scenario to another computer. Each user runs
their own copy; browser data is not shared with other users.

For a production build:

```sh
npm run build
npm start
```

The server binds to loopback by default. Dependencies require internet for installation;
the installed no-key simulator works locally without internet. Node is the only runtime
requirement. Any editor, VS Code, Laya or coding agent can work with this source.

## What works

- Create, validate, edit, save, reload, delete and import dilemmas.
- Fully implemented **Bootstrap vs Raise** template with a third hiring branch.
- Immediate deterministic recomputation, 24 monthly rows, cash curves and branch comparison.
- Starting cash, revenue, expenses, margins, growth, churn, customers, financing,
  pre-money valuation, founder ownership, one-time capex and hiring step changes.
- Every numeric field has units, allowed range, default, provenance, explanation
  and last-edited time (hover the provenance badge).
- Baseline inheritance, branch overrides, reset to baseline and metric sorting.
- One-variable growth sensitivity and two-variable growth/expense runway heatmap.
- JSON import/export, selected-branch CSV, PNG snapshot and small hash-encoded share links.
- Optional Gemini candidate generation with consent, review and preservation of edited numbers.
- Keyboard branch buttons, mobile layout, focus states and reduced-motion support.
- A live home-page model and a chart-first workspace, with HyperFrames-inspired
  visual hierarchy and restrained motion. See [design direction](docs/DESIGN.md).

Other starter templates are intentionally hidden until their economics are implemented.

## Architecture

![Layered Time Machine architecture](docs/architecture.svg)

[Architecture note](docs/ARCHITECTURE.md) · [SVG source](docs/architecture.svg) ·
[PNG diagram](docs/architecture.png) · [Assumptions and equations](docs/ASSUMPTIONS.md)

Next.js App Router + TypeScript + Tailwind + a shadcn-derived button + React Flow +
Recharts + Zod. The engine has no React or model dependency. Browser storage avoids
a server database; server disk is used only for optional AI budgets and cache.

## Optional Gemini setup — default is off

1. Copy `.env.example` to `.env.local`.
2. Use a Gemini project **without billing enabled**. Never enable billing for this app.
3. Personally verify a model's **standard free-tier input and output availability** on
   [Google's official pricing page](https://ai.google.dev/gemini-api/docs/pricing).
4. Put its exact identifier in `GEMINI_MODEL` and `FREE_MODEL_ALLOWLIST`. No model is
   preselected. Set `FREE_MODEL_VERIFIED_ON` to your verification date (`YYYY-MM-DD`);
   verification expires after 30 days.
5. Set `GEMINI_UNBILLED_PROJECT_CONFIRMED=true` only for that unbilled project, and set
   `GEMINI_API_KEY` server-side. Restart the server.
6. In the workspace, confirm that the dilemma is non-confidential and click
   **Generate candidates**. Review or edit inferred values, then explicitly apply them.

Google documents that free-tier availability varies by model and free-tier inputs may
be used to improve its products. Do not send private business documents, credentials,
secrets or confidential information. The app cannot reliably verify billing status or
free eligibility through `models.list`; operator confirmation is required, not a
guarantee of price or quota. No paid failover, browsing, grounding or extra AI services.

The connector uses the official `@google/genai` SDK and structured JSON output.
Defaults: **10 requests per UTC day**, **3 total attempts per run**, **3,000 output
tokens**, **16 KB serialized input cap**, **20-second timeout per attempt**.
Every attempted provider request consumes budget, including failed requests. The SDK's
own retries are disabled; local bounded retries back off on 429/transient server errors.
There is at most one schema-correction retry within that same per-run cap.

Validated responses are cached by SHA-256 of model + prompt version + input. Cache
hits do not consume a request. The UI makes failures visible and offers the local
template; it never fabricates a successful AI response. Test fixtures are labeled.

`.data/quota.json` and `.data/cache/` are local and gitignored. A disk lock prevents
concurrent servers sharing this directory from exceeding the budget. If the process
crashes while holding `.data/quota.lock`, stop all app processes and remove **only
that empty lock directory**, preserving `quota.json`. Corrupt quota data fails closed.
Do not delete or replace the ledger to bypass your request limit.

## Equations

For each month, with percentage inputs converted to fractions:

```text
revenue[t] = revenue[t−1] × (1 + growth) × (1 − churn)
COGS[t] = revenue[t] × (1 − gross_margin)
gross_profit[t] = revenue[t] − COGS[t]
OpEx[t] = recurring_expenses + (hiring_cost if t >= hiring_month)
operating_CF[t] = gross_profit[t] − OpEx[t]
cash[t] = cash[t−1] + operating_CF[t] + financing[t] − capex[t]
investor_fraction = investment / (pre_money + investment)
founder_ownership_after = founder_ownership_before × pre_money / (pre_money + investment)
```

Cash received and revenue recognized are assumed to coincide; no receivables,
taxes, debt, interest or deferred revenue. Runway is the **first** month ending cash
is ≤ 0 (or month zero when starting cash is zero). “Beyond 24 mo” means only that
the cash balance stayed positive during this horizon. Late financing cannot undo
an earlier shortfall. Financing is received at the beginning of its specified month;
within-month liquidity is not modeled.

Funding gap is the extra cash needed **at month zero** to keep every modeled month
strictly above zero, rounded upward to a cent. It is not a recommended raise.
Dilution is a single simplified priced round; unknown valuation suppresses it.

## Exact sample

The complete, importable versioned fixture is [fixtures/sample-saas.json](fixtures/sample-saas.json).
Its numerical baseline is:

```json
{
  "cash": 50000,
  "revenue": 4000,
  "expenses": 7000,
  "margin": 80,
  "customers": 40,
  "growth": 5,
  "churn": 2,
  "financing": 0,
  "financingMonth": 1,
  "valuation": 1000000,
  "ownership": 100,
  "capex": 0,
  "capexMonth": 1,
  "hiring": 0,
  "hiringMonth": 3
}
```

All are fictional USD assumptions. The hiring path adds 10,000/month from month 3
and assumes 8% gross monthly growth. The raising path receives 200,000 in month 1
at a hypothetical 1,000,000 pre-money valuation. These choices are editable;
the model does not claim hiring causes growth.

## Verify it

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
node scripts/audit-licenses.mjs
```

| Coverage | What is checked |
|---|---|
| Cash engine | Hand-calculated golden months, zero revenue/burn, negative growth, 0/100% margin and churn |
| Financing | Month 1/24 boundaries, prior cash failure, capex and hiring timing, unknown valuation |
| Determinism | Stable input fingerprints, fixed-timestamp snapshots, defaults, outliers and sensitivity |
| Data boundaries | Corrupt/oversized import, schema versions, UUIDs, provenance, Unicode shares and CSV rows |
| AI safety | Missing key/consent, operator eligibility, request size, durable/concurrent quotas, corrupt ledger |
| Browser | Create → branch → edit → save/reload → export, no-key error, mobile layout and candidate review |

See [verification results](docs/VERIFICATION.md), [demo recording guide](docs/DEMO.md)
and the [condensed 15-second browser recording](docs/media/transformation.mp4)
([full recording](docs/media/transformation.webm)).
The screenshots in [docs/screenshots](docs/screenshots) show the real application. No live Gemini result
is claimed without a configured, verified key.

![Interactive model workspace](docs/screenshots/workspace.png)

## Sharing and deployment

GitHub contains the complete source. Others can clone and run the commands above.
No hosting account or required spend. A hash share contains the full scenario in the
URL fragment; anyone with the link can read it. It is not encryption. Localhost links
need the origin changed to the recipient's running app address. Large scenarios use JSON.

Optional public hosting is not configured: no host or payment is required. A public
instance should keep Gemini disabled unless access is restricted; otherwise visitors
could consume its small shared quota. File budgets require durable local disk and a
shared directory per deployment. Ephemeral/serverless or multiple-host deployments
need an appropriate shared quota store before enabling Gemini.

## Honest limits

- Monthly, constant-rate conditional model; no uncertainty probabilities or market data.
- Only one priced financing round; no SAFEs, option pools, liquidation preferences or later rounds.
- Growth, churn and margin remain fixed; customer counts are illustrative.
- Negative cash curves continue to expose the gap; they do not imply operations can continue.
- Browser storage is limited to 50 scenarios, can be cleared, and has no cross-device sync.
- Unsaved edits are guarded on reload and app navigation; browser crash can still lose them.
- No accounts, teams, bank connections, payments, execution of generated code or third-party PRs.
- Currency changes relabel numbers; no exchange-rate conversion.
- PNG depends on browser canvas support; browser screenshots are the fallback.
- Operator verification cannot guarantee continuing provider free eligibility or quota.

## Contribute and license

See [CONTRIBUTING](CONTRIBUTING.md). Original code and diagram are [MIT](LICENSE).
Dependencies and their notices retain their own licenses; see the generated
[third-party license inventory](docs/THIRD_PARTY_LICENSES.md).
