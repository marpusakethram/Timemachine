# Time Machine v1.0.0

A local-first decision modeling tool for startup teams, with a fully working demo that
needs no API key.

- Compare bootstrap, hiring and a hypothetical priced round side by side.
- Change growth, capital, costs and more. Runway and ownership update instantly.
- Save locally, and export or import JSON, a monthly CSV, a PNG or a small share link.
- Optional Gemini suggestions with consent, a review step, operator checked free models,
  a request budget that survives restarts, and no paid fallback.
- A clean, light B2B interface: a product style home page, an app shell workspace with a
  KPI strip, and a mobile layout.
- Comes with the architecture diagram (SVG and PNG), source, setup guide, assumptions,
  license list, screenshots and a real browser recording.

Checked: TypeScript, production build, 41 unit and integration tests, and 4 browser
workflows. npm audit reports zero vulnerabilities.

Run it with Node.js 22.12+: `npm ci`, then `npm run dev`.
Open http://127.0.0.1:3000 and pick the fictional SaaS demo.

Everything it shows is a "what if" model. Live Gemini wasn't tested. The connector was
checked with labeled fixtures and the real no-key error path. You don't need any paid
service or public hosting.
