"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="state-page"><span className="badge">Something broke</span><h1>The workspace could not load.</h1><p>Your saved browser data is still there. Nothing was deleted.</p><div className="state-actions"><button className="button button-primary" onClick={reset}>Try again</button><a className="button button-outline" href="/">Back to workbench</a></div></main>;
}
