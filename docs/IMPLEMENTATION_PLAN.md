# Build checkpoints

1. Schemas, sample data, and the local create, save, reload and edit flow. Check every import.
2. A pure, repeatable engine with hand calculated golden cases and at least 12 unit tests.
3. Working assumptions, cash charts, the decision map, comparisons and sensitivity.
4. A limited, optional Gemini route: operator checked free model, a budget that survives
   restarts, a cache, retry limits, explicit consent and a review step. The simulator has
   to work without any API.
5. JSON, CSV, PNG and share links, keyboard and mobile checks, broken imports and error states.
6. Typecheck, production build, unit, integration and browser tests, plus a license audit.
7. README, equations, architecture, contributing and license docs, screenshots and a recording guide.

What this touches: the app routes, interactive components, simulation and AI schemas, local
storage, import and export, fixtures, test config and the operator docs. There were no
existing user files. The big risks are bad imported data, accidentally sending data to the
cloud or spending money, losing edited numbers when regenerating, and making "what if"
outputs look like forecasts. Safe defaults and tests cover all of those.

Keeping data in the browser means no server database and no accounts, and different people
can each use their own copy. The server disk only holds API quota counts and the AI cache.
Public hosting and a GitHub release are optional extras, not requirements.
