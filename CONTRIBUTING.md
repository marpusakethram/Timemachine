# Contributing

Use Node.js 22.12 or newer and install with `npm ci`. Work on a branch and keep changes small.

Before you open a pull request, run:

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

A few house rules:

- **Formulas:** if you change the math, add hand calculated reference numbers and engine tests.
- **Saved data format:** if you change the schema, decide on a schema version bump or a
  migration, and say so. Never quietly throw away someone's saved scenarios.
- **AI stays optional:** the no-key demo has to keep working.
- **Screenshots:** if you change the UI, run `npm run test:e2e` so `public/screens` and
  `docs/screenshots` get recaptured from the real app.

Please don't commit `.env.local`, API keys, `.data`, browser storage or private scenarios.
Don't add paid services or automatic billing or failover. Never run model output as code.
If you can't reach a live external API, use fixtures and label them as fixtures.

When behavior changes, update the architecture, assumptions and limits docs too. If you add
a dependency or asset, check its license and refresh the third-party list with
`node scripts/audit-licenses.mjs`. Keep upstream license notices intact.

For bugs, share what you expected, what happened, and a small scenario that isn't
confidential. For security issues, don't post keys or private data in a public issue.
