# A 15-second transformation demo

Run the app, open the fictional SaaS demo, and select the raising branch.
Use a browser viewport around 1440 × 1000. No Gemini key is needed.

| Seconds | Action |
|---|---|
| 0–3 | Show the decision and three paths; select Raise $200k |
| 3–7 | Move the Capital raised slider from 200,000 toward 400,000 |
| 7–11 | Show the cash curve rise and founder ownership fall from 83.3% to 71.4% |
| 11–15 | Select Bootstrap conservatively to contrast runway and dilution |

Use Windows Snipping Tool's screen recording or any local recorder. Crop out browser
chrome and avoid personal tabs. Save MP4/GIF locally; the repository screenshots are
produced by Playwright, not mockups. The architecture SVG has a separately rendered PNG.

The repeatable browser demonstration is in `tests/e2e/demo.spec.ts`; Playwright
records a WebM video for this test and the release includes a copy when generated.
The MP4 is a time-condensed 15-second version of that real recording; it does not
replace the UI with simulated frames. FFmpeg is only used to prepare this optional
release asset, not required to install or run the app.

Launch text:

> Time Machine is an open-source decision lab for founders. Compare bootstrapping,
> hiring and a hypothetical raise, then move the assumptions to see cash runway
> and ownership change immediately. Local-first, no signup, no required API key.
> Conditional models, not predictions or financial advice.
