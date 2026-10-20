# Implementation gates

1. Schemas, sample and local create/save/reload/edit flow. Validate all imported input.
2. Pure deterministic engine; hand-calculated golden cases; at least 12 unit tests.
3. Functional assumptions, cash charts, branch graph, comparisons and sensitivity.
4. Bounded optional Gemini route; free-model operator verification, durable budget, cache,
   retry limits, explicit consent and candidate review. Simulator must work without API.
5. JSON/CSV/PNG/share, keyboard and mobile checks, corrupt import and error states.
6. Typecheck, production build, unit/integration/e2e tests; dependency license audit.
7. README, equations, architecture, contribution/license, screenshots and recording guide.

Scope touches the app routes, interactive components, simulation and AI schemas,
local storage/import/export, fixtures, test configuration and operator documentation.
No existing user files are present. The important risks are imported malformed data,
accidental cloud disclosure/spend, edited-number loss on regeneration, and presenting
conditional outputs as forecasts. Safe defaults and tests cover those boundaries.

Local browser persistence avoids a server database and makes the app usable by separate
users without accounts. Server disk holds only API quota counts and generated cache.
Public hosting and GitHub release are optional distribution steps, not required services.
