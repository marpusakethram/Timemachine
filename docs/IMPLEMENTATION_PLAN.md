# How it was built, step by step

1. Schemas, the sample, and the local create, save, reload and edit flow. Check
   every imported input.
2. A pure, repeatable engine with hand-checked cases and at least 12 unit tests.
3. Working assumptions panel, cash charts, decision map, comparisons and sensitivity.
4. The optional, capped Gemini route: free-model checks by the operator, a lasting
   budget, a cache, retry limits, explicit consent and a review step. The simulator
   has to work without any API.
5. JSON, CSV, PNG and share links, keyboard and mobile checks, broken imports and
   error states.
6. Typecheck, production build, unit, integration and browser tests, and a license audit.
7. README, equations, architecture, contributing and license docs, screenshots and a
   recording guide.

The work covers the app pages, interactive components, the simulation and AI
schemas, browser storage, import and export, fixtures, test setup and operator docs.

The big risks were bad imported data, accidentally sending data to the cloud or
spending money, losing numbers you typed when AI regenerates, and making "what if"
results look like forecasts. Safe defaults and tests cover each of those.

Keeping data in the browser means no server database, and different people can use
the app without accounts. The server's disk only stores API quota counts and cached
AI results. Public hosting and GitHub releases are optional extras, not requirements.
