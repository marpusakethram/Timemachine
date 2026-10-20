"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="loading"><h1>The workspace could not render.</h1><p>Your saved browser data has not been deleted.</p><button onClick={reset}>Try again</button><a href="/">Return to workbench</a></main>;
}
