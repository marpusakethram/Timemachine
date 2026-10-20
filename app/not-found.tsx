import Link from "next/link";
export default function NotFound() { return <main className="state-page"><span className="badge">404</span><h1>This page does not exist.</h1><p>The link might be old or mistyped.</p><div className="state-actions"><Link className="button button-primary" href="/">Back to your decisions</Link></div></main>; }
