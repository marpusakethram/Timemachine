# The 15 second demo

Run the app, open the fictional SaaS demo, and pick the raise path. A browser window
around 1440 × 1000 looks best. You don't need a Gemini key.

| Seconds | What to do |
|---|---|
| 0 to 3 | Show the decision and the three paths, then click Raise $200k |
| 3 to 7 | Drag Capital raised from 200,000 toward 400,000 |
| 7 to 11 | Point out the cash line going up and ownership dropping from 83.3% to 71.4% |
| 11 to 15 | Click Bootstrap conservatively to compare runway and dilution |

Use any screen recorder you like (on Windows, Snipping Tool works). Crop out the
browser bar and any personal tabs. The screenshots in this repo come from
Playwright, not mockups. The architecture SVG has its own PNG render.

There's also a repeatable recording in `tests/e2e/demo.spec.ts`. It drives the real
app through this flow and saves a WebM through Playwright's video recorder.

The current files in `docs/media` were made from frame-by-frame screenshots of the
real app running that same flow, then stitched with FFmpeg. (Playwright's built-in
recorder wasn't available in the environment that made them.) The WebM plays at
normal speed. The MP4 is the same frames stretched to exactly 15 seconds. No frames
are fake. FFmpeg is only needed to make these optional videos, not to install or run
the app.

Launch blurb you can copy:

> Time Machine is an open-source decision lab for founders. Compare bootstrapping,
> hiring and a pretend raise, then drag the assumptions and watch runway and
> ownership change instantly. Runs in your browser, no signup, no API key.
> It's a "what if" model, not a prediction or financial advice.
