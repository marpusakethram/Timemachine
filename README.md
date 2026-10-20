# Time Machine

**Don't guess. Move the assumptions.**

Time Machine is a decision lab for startup founders. You frame a decision, pick one
of three paths (bootstrap, hire or raise), drag a slider, and watch runway and
founder ownership update right away. It all runs in your browser.

Heads up: these are "what if" models. They're not forecasts and they're not
investment advice.

![Time Machine home page with the live ownership model](docs/screenshots/home.png)

## Run it

You need **Node.js 22.12+** and npm. That's it. No account, no API key, no paid
service, no database.

```sh
git clone https://github.com/marpusakethram/Timemachine.git
cd Timemachine
npm ci
npm run dev
```

Open **http://127.0.0.1:3000** and click **Open the fictional SaaS demo**.
The main trick takes less than a minute:

1. Click **Raise $200k**.
2. Drag **Capital raised** from 200,000 to 400,000.
3. Watch the cash line jump and founder ownership drop from **83.3% to 71.4%**.
4. Flip over to the bootstrap and hiring paths to compare, then export JSON or CSV.

The demo never calls the cloud. **Save** writes to your browser's localStorage, so
your scenarios stay on your machine. If you want a backup or need to move a
scenario to another computer, export it as JSON. Everyone who runs the app gets
their own copy, and nothing is shared between users.

For a production build:

```sh
npm run build
npm start
```

The server only listens on your own machine (127.0.0.1) by default. You need
internet once to install dependencies. After that the simulator works fully offline.

## What it does

- Create, edit, save, reload, delete and import decisions.
- Ships with one complete template, **Bootstrap vs Raise**, plus a third hiring path.
- Recalculates instantly: 24 monthly rows, cash curves and a side by side comparison.
- Lets you tweak starting cash, revenue, expenses, margin, growth, churn, customers,
  funding, pre-money valuation, founder ownership, one-time spend and hiring costs.
- Every number shows its unit, allowed range, default, where it came from and when
  you last edited it (hover the little source badge).
- Paths inherit from a shared baseline, and you can reset any path back to it.
- A sensitivity lab shows how growth and spending change your runway.
- Exports: JSON, a CSV of the selected path, a PNG snapshot, and short share links.
- Optional Gemini helper that suggests assumptions. It's off by default and always
  asks you to review before anything changes.
- Works with a keyboard, works on phones, has visible focus states and respects
  reduced motion settings.
- Light and dark mode follow your system setting.

Other templates are hidden until their math is actually built.

## How it's built

![Time Machine architecture diagram](docs/architecture.svg)

More detail: [architecture](docs/ARCHITECTURE.md), [assumptions and equations](docs/ASSUMPTIONS.md),
[design notes](docs/DESIGN.md), [diagram source](scripts/create-architecture.mjs),
[PNG version](docs/architecture.png).

Stack: Next.js App Router, TypeScript, Tailwind, a shadcn-style button, React Flow,
Recharts and Zod. The math engine doesn't touch React or the network. Your data
lives in the browser, so there's no server database. The server's disk is only used
for the optional AI budget and cache.

## Optional Gemini setup (off by default)

You don't need this. Skip it unless you want AI suggestions.

1. Copy `.env.example` to `.env.local`.
2. Use a Gemini project **with billing turned off**. Don't turn billing on for this app.
3. Check Google's [pricing page](https://ai.google.dev/gemini-api/docs/pricing) yourself
   and confirm the model you want is on the free tier for both input and output.
4. Put that exact model name in `GEMINI_MODEL` and `FREE_MODEL_ALLOWLIST`. Nothing is
   picked for you. Set `FREE_MODEL_VERIFIED_ON` to the date you checked (`YYYY-MM-DD`).
   That check expires after 30 days.
5. Set `GEMINI_UNBILLED_PROJECT_CONFIRMED=true` (only for that unbilled project) and
   set `GEMINI_API_KEY`. Restart the server.
6. In the workspace, tick the box saying your decision isn't confidential, then click
   **Generate candidates**. Look over the suggested numbers, edit them if you want,
   and apply them yourself.

A few honest warnings. Google says free-tier inputs may be used to improve their
products, so don't paste private documents, passwords, secrets or anything
confidential. The app can't check your billing status or free-tier eligibility on
its own, which is why it asks you to confirm. That confirmation isn't a guarantee
about price or quota. There's no paid fallback, no web browsing and no extra AI services.

How the limits work:

- Uses the official `@google/genai` SDK with structured JSON output.
- **10 requests per UTC day**, **3 attempts per run**, **3,000 output tokens**,
  **16 KB max input**, **20 second timeout per attempt**.
- Every attempt counts against the budget, even failed ones.
- The SDK's own retries are off. The app retries a little on 429s and temporary
  server errors, plus at most one retry to fix a bad response shape.
- Good responses are cached by a SHA-256 hash of model, prompt version and input.
  Cache hits are free.
- If something fails, the app tells you and offers the local template. It never
  fakes a successful AI answer. Test fixtures are clearly labeled.

`.data/quota.json` and `.data/cache/` live on your machine and are gitignored. A lock
folder stops two servers sharing that folder from going over budget. If the app
crashes while holding `.data/quota.lock`, stop every app process and delete **only
that empty lock folder**. Keep `quota.json`. If the quota file is corrupt, the app
refuses to call the API. Don't delete the ledger to get around your limit.

## The equations

Every month, with percentages turned into fractions:

```text
revenue[t]       = revenue[t-1] × (1 + growth) × (1 - churn)
COGS[t]          = revenue[t] × (1 - gross_margin)
gross_profit[t]  = revenue[t] - COGS[t]
OpEx[t]          = recurring_expenses + (hiring_cost if t >= hiring_month)
operating_CF[t]  = gross_profit[t] - OpEx[t]
cash[t]          = cash[t-1] + operating_CF[t] + financing[t] - capex[t]
investor_share   = investment / (pre_money + investment)
founder_after    = founder_before × pre_money / (pre_money + investment)
```

Some simplifications to know about:

- Cash comes in the same month revenue is booked. No receivables, taxes, debt,
  interest or deferred revenue.
- **Runway** is the first month where ending cash hits zero or below (month zero if
  you start with no cash). "Beyond 24 mo" just means cash stayed positive for the
  whole 24 months.
- Money raised late can't undo running out earlier.
- Funding lands at the start of its month. Cash timing inside a month isn't modeled.
- **Funding gap** is the extra cash you'd need on day one to keep every month above
  zero, rounded up to the cent. It's not a suggested raise amount.
- Dilution assumes one simple priced round. If valuation is unknown (0), dilution is hidden.

## The sample numbers

The full importable sample is [fixtures/sample-saas.json](fixtures/sample-saas.json).
Its baseline:

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

All of it is made up, in USD. The hiring path adds $10,000 a month starting in
month 3 and assumes 8% monthly growth. The raise path gets $200,000 in month 1 at a
pretend $1,000,000 pre-money valuation. You can change all of this. The model
doesn't claim hiring causes growth.

## Check that it works

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
node scripts/audit-licenses.mjs
```

| Area | What gets tested |
|---|---|
| Cash engine | Hand-calculated months, zero revenue or burn, negative growth, 0% and 100% margin and churn |
| Funding | Month 1 and 24 edges, running out before money lands, capex and hiring timing, unknown valuation |
| Repeatability | Stable input fingerprints, fixed-time snapshots, defaults, outliers and sensitivity |
| Data safety | Broken or huge imports, schema versions, IDs, sources, Unicode share links and CSV rows |
| AI safety | Missing key or consent, operator checks, request size, quotas under concurrency, corrupt ledger |
| Browser | Create, pick a path, edit, save, reload, export, no-key error, mobile layout, AI review |

See [verification results](docs/VERIFICATION.md), the [demo guide](docs/DEMO.md) and the
[15 second screen recording](docs/media/transformation.mp4)
([full recording](docs/media/transformation.webm)). Screenshots in
[docs/screenshots](docs/screenshots) are real captures from Playwright, not mockups.
No live Gemini result is shown because none was run without a verified key.

![Time Machine workspace](docs/screenshots/workspace.png)

## Sharing and hosting

All the source is on GitHub, so anyone can clone it and run the steps above. No
hosting account or spending needed.

A share link packs the whole scenario into the URL after the `#`. Anyone who has the
link can read it. It's not encrypted. Links made on localhost need the address swapped
for wherever the other person runs the app. Big scenarios should go through JSON instead.

Public hosting isn't set up. If you host it publicly, keep Gemini off unless you lock
down access, or random visitors could burn through your small shared quota. The quota
files need a real, lasting disk shared by the whole deployment. Serverless or
multi-server setups need a shared quota store before you turn Gemini on.

## Honest limits

- Monthly model with fixed rates. No probabilities and no market data.
- Only one priced round. No SAFEs, option pools, liquidation preferences or later rounds.
- Growth, churn and margin stay flat. Customer counts are just for illustration.
- When cash goes negative the line keeps going so you can see the gap. That doesn't
  mean the company could actually keep running.
- Browser storage holds up to 50 scenarios, can be wiped, and doesn't sync across devices.
- The app warns you about unsaved edits, but a browser crash can still lose them.
- No accounts, teams, bank connections, payments, running AI-written code or outside PRs.
- Changing currency just relabels numbers. There's no exchange-rate conversion.
- PNG export depends on your browser. If it fails, take a normal screenshot.
- Checking the free tier yourself can't guarantee Google keeps it free.

## Contributing and license

See [CONTRIBUTING](CONTRIBUTING.md). Our own code and diagram are [MIT](LICENSE).
Dependencies, fonts included, keep their own licenses. See the
[third-party license list](docs/THIRD_PARTY_LICENSES.md).
