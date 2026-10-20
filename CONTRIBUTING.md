# Contributing

Use Node.js 22.12+ and run `npm ci`. Work on a branch and keep changes small.

Before you open a pull request, run:

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

A few rules:

- If you change a formula, add a hand-worked example and an engine test for it.
- If you change the saved data shape, bump the schema version on purpose and decide
  how old saves migrate. Never quietly throw away someone's saved scenarios.
- AI stays optional. The no-key demo must always work.
- Don't commit `.env.local`, API keys, `.data`, browser storage or private scenarios.
- Don't add paid services or automatic billing or failover. Never run code a model wrote.
- If you can't reach a live API, use test fixtures and label them as fixtures.

When behavior changes, update the architecture, assumptions and limits docs too.
If you add a dependency, font or asset, check its license and refresh the inventory
with `node scripts/audit-licenses.mjs`. Keep upstream license notices intact.

Found a bug? Tell us what you expected, what happened instead, and share a small
scenario that isn't confidential. For security issues, don't post keys or private
data in a public issue.
