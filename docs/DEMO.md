# The 15 second demo

Run the app, open the fictional SaaS demo, and pick the raise path. A browser window around
1440 × 1000 works best. You don't need a Gemini key.

| Seconds | What happens |
|---|---|
| 0 to 3 | Show the decision and the three paths, then pick path C, Raise $200k |
| 3 to 7 | Slide Capital raised from 200,000 toward 400,000 |
| 7 to 11 | The cash line goes up and founder ownership drops from 83.3% to 71.4% |
| 11 to 15 | Pick path A, Bootstrap conservatively, to compare runway and dilution |

Want to record it yourself? Any screen recorder works, like the Windows Snipping Tool.
Crop out the browser bar and close personal tabs. The screenshots in this repo come from
Playwright, not mockups. The architecture SVG has its own rendered PNG.

The repeatable version lives in `tests/e2e/demo.spec.ts`. Playwright records a WebM of the
real app while it runs. The MP4 and WebM in `docs/media` show the real app too, built from
real browser frames of the same steps, not fake animation. FFmpeg is only used to package
those files. You don't need it to install or run the app.

Launch blurb you can copy:

> Time Machine is an open source decision modeling tool for startup teams. Compare
> bootstrapping, hiring and a hypothetical raise, then move the assumptions and watch
> runway and ownership change instantly. Runs in your browser, no signup, no API key
> needed. These are "what if" models, not predictions or financial advice.
