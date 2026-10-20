"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EyeOff, FileUp, Lock, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Brand } from "./brand";
import { sampleDecision } from "@/lib/sample";
import { Decision, metadata } from "@/lib/simulation/models";
import { listScenarios, removeScenario, saveScenario } from "@/lib/storage/scenario-store";
import { decodeShare, importScenario, MAX_IMPORT_BYTES } from "@/lib/export/share";
import { DecisionPreview } from "./decision-preview";

// Real screenshots of the app, captured by tests/e2e/screens.spec.ts.
function Shot({ src, alt, width, height, className = "", eager = false }: { src: string; alt: string; width: number; height: number; className?: string; eager?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`shot ${className}`} src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" />;
}

export function DecisionInput() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState<Decision[]>([]);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      // localStorage only exists after hydration, so the first read has to happen here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(listScenarios());
      if (location.hash.startsWith("#scenario=")) {
        const imported = decodeShare(location.hash);
        // Imported links become a new local copy, never overwrite an existing scenario.
        imported.id = crypto.randomUUID();
        saveScenario(imported);
        history.replaceState(null, "", "/");
        router.push(`/scenario/${imported.id}`);
      }
    } catch { setError("That share link or your saved data couldn't be read, so nothing was changed. Import a JSON backup instead."); }
  }, [router]);
  function create(sample: boolean) {
    try {
      const decision = sampleDecision();
      if (!sample) {
        decision.title = title;
        decision.description = description;
      }
      saveScenario(Decision.parse(decision));
      router.push(`/scenario/${decision.id}`);
    } catch { setError("Add a name and a short description, then try again. If it still fails, this browser may be blocking local storage."); }
  }
  return <div className="site">
    <header className="site-header"><div className="wrap site-header-inner">
      <Brand />
      <nav className="site-nav" aria-label="Page sections"><a href="#inside">Inside the app</a><a href="#new-decision">New decision</a><a href="#workbench">Your decisions</a><a href="https://github.com/marpusakethram/Timemachine">GitHub</a></nav>
      <Button size="sm" onClick={() => create(true)}>Try the demo</Button>
    </div></header>
    <main>
      <section className="hero">
        <div className="wrap hero-copy">
          <h1>Hire, raise or stay lean. See the next 24 months first.</h1>
          <p className="lead">Time Machine models cash, runway and ownership for three paths at once. Change a number and every chart redraws on the spot. It runs in your browser, so your numbers stay with you.</p>
          <div className="hero-actions"><Button size="lg" onClick={() => create(true)}>Open the fictional SaaS demo</Button><a href="#new-decision" className="button button-outline button-lg">Start your own decision</a></div>
        </div>
        <div className="wrap">
          <div className="hero-stage">
            <Shot className="hero-shot" src="/screens/workspace.jpg" alt="The Time Machine workspace comparing three paths for a fictional SaaS company" width={2880} height={1720} eager />
            <DecisionPreview />
          </div>
        </div>
      </section>

      <section className="block" id="inside"><div className="wrap">
        <div className="block-head"><h2>Everything you need to make the call, on one screen.</h2><p>These are real screenshots. Our test suite opens the app, clicks through the demo and captures them, so what you see is what you get.</p></div>
        <div className="mosaic">
          <article className="tile tile-wide"><div className="tile-copy"><h3>Three paths, side by side</h3><p>Runway, cash at month 24, funding gap and founder ownership for every option. Pick one and the whole workspace follows it.</p></div><Shot src="/screens/compare.jpg" alt="Comparison cards for the bootstrap, hire and raise paths" width={1544} height={856} /></article>
          <article className="tile tile-tall"><div className="tile-copy"><h3>Works on your phone</h3><p>Check the numbers before the meeting, not after.</p></div><Shot className="shot-phone" src="/screens/mobile.jpg" alt="The workspace on a phone sized screen" width={780} height={1560} /></article>
          <article className="tile"><div className="tile-copy"><h3>Every number is yours to change</h3><p>Each input shows its unit, its limits and where it came from.</p></div><Shot src="/screens/assumptions.jpg" alt="The assumptions panel with growth, expenses and capital inputs" width={580} height={1616} /></article>
          <article className="tile"><div className="tile-copy"><h3>Stress test the plan</h3><p>See how runway moves when growth slips or spending climbs.</p></div><Shot src="/screens/sensitivity.jpg" alt="A grid of runway months for different growth and spending levels" width={1544} height={1280} /></article>
        </div>
      </div></section>

      <section className="block block-mist" id="new-decision"><div className="wrap create-grid">
        <div className="create-copy">
          <h2>Start with your own question.</h2>
          <p>Give it a name and describe the choice in a sentence or two. You get the bootstrap, hire and raise template with sample numbers, ready for you to make them yours.</p>
          <ul className="plain-list">
            <li><Lock size={16} /><span>Saved in this browser only. No signup, no bank login, no API key.</span></li>
            <li><EyeOff size={16} /><span>Nothing leaves your device unless you export it or share a link.</span></li>
            <li><Sparkles size={16} /><span>AI suggestions are off until you turn them on and review them.</span></li>
          </ul>
          <p className="small">These are &ldquo;what if&rdquo; models, not forecasts or financial advice.</p>
        </div>
        <div className="panel create-panel">
          <form onSubmit={e => { e.preventDefault(); create(false); }}>
            <label className="field" htmlFor="title"><span>Give it a name</span></label><input id="title" placeholder="Bootstrap or raise our first round?" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required />
            <label className="field" htmlFor="description"><span>The dilemma</span><span className="counter">{description.length}/1500</span></label><textarea id="description" placeholder="We have a promising product and a small team. Should we stay lean, hire, or raise to buy more time?" value={description} onChange={e => setDescription(e.target.value)} maxLength={1500} required rows={4} />
            <div className="template-note"><span className="template-mark" aria-hidden="true"><i className="key key-sky" /><i className="key key-marigold" /><i className="key key-mint" /></span><span><strong>Bootstrap, hire or raise</strong> Three paths over 24 months</span></div>
            <Button type="submit" size="lg" className="wide">Preview my decision</Button>
          </form>
        </div>
      </div></section>

      <section className="block" id="workbench"><div className="wrap">
        {error && <p className="notice notice-error" role="alert">{error}</p>}
        <div className="block-head block-head-row"><div><h2>Your decisions</h2><p>Saved in this browser. Export a backup from any decision to keep a copy.</p></div><Button variant="outline" onClick={() => file.current?.click()}><FileUp size={16} />Import JSON</Button></div>
        <input ref={file} hidden type="file" accept=".json,application/json" onChange={async e => {
          try {
            const f = e.target.files?.[0]; if (!f) return;
            if (f.size > MAX_IMPORT_BYTES) throw new Error("File too large.");
            const d = importScenario(await f.text()); d.id = crypto.randomUUID(); d.updatedAt = metadata("entered", "").lastEdited;
            saveScenario(d); router.push(`/scenario/${d.id}`);
          } catch { setError("Invalid or oversized JSON. Import a Time Machine v1 export of 100 KB or less. Nothing was overwritten."); }
          e.target.value = "";
        }} />
        <div className="panel table-panel">
          {!saved.length ? <div className="empty-state"><p><strong>Nothing saved yet.</strong> Open the demo or start your own decision and it will show up here.</p><a href="#new-decision" className="button button-outline">Start a decision</a></div>
            : <div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">Decision</th><th scope="col">Paths</th><th scope="col">Last edited</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>{saved.map(s => <tr key={s.id}>
              <td><Link href={`/scenario/${s.id}`} className="row-link">{s.title}</Link></td>
              <td className="muted-cell">{s.branches.map(b => b.name).join(", ")}</td>
              <td className="muted-cell">{new Date(s.updatedAt).toLocaleDateString()}</td>
              <td className="row-actions"><Link href={`/scenario/${s.id}`} className="button button-ghost button-sm">Open</Link><Button variant="ghost" size="sm" aria-label={`Delete ${s.title}`} onClick={() => {
                if (!confirm("Delete this local scenario? Export a backup first if you need it.")) return;
                try { removeScenario(s.id); setSaved(listScenarios()); } catch { setError("Could not remove the scenario from browser storage."); }
              }}><Trash2 size={15} /></Button></td>
            </tr>)}</tbody></table></div>}
        </div>
      </div></section>
    </main>
    <footer className="site-footer"><div className="wrap site-footer-inner">
      <Brand />
      <p>Model the trade-off before you commit. No bank connections, no market feeds, just your numbers.</p>
      <nav aria-label="Footer"><a href="https://github.com/marpusakethram/Timemachine">Source code</a><a href="https://github.com/marpusakethram/Timemachine/blob/main/LICENSE">MIT license</a></nav>
    </div></footer>
  </div>;
}
