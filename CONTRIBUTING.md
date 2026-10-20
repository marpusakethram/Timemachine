# Contributing

Use Node.js 22.12+ and `npm ci`. Work in a branch and keep changes small.

Before a pull request, run:

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Changes to formulas need hand-calculated references and engine tests. Changes to the
serialized schema need an explicit schema version/migration decision. Never silently
discard saved scenarios. Keep AI optional and preserve the no-key demo.

Do not commit `.env.local`, keys, `.data`, browser storage or private scenarios.
Do not add paid services or automatic billing/failover. Never execute model output.
Use fixtures marked as fixtures when live external API access is unavailable.

Update architecture, assumptions and limitations when behavior changes. If adding a
dependency or asset, check its license and update the third-party inventory using
`node scripts/audit-licenses.mjs`. Preserve upstream license notices.

Report reproducible bugs with expected/actual results and a non-confidential minimal
scenario. For a security issue, avoid publishing keys or private data in public issues.
