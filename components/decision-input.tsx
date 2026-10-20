"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FileUp, GitBranch, Lock, ScanLine, SlidersHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Brand } from "./brand";
import { sampleDecision } from "@/lib/sample";
import { Decision, metadata } from "@/lib/simulation/models";
import { listScenarios, removeScenario, saveScenario } from "@/lib/storage/scenario-store";
import { decodeShare, importScenario, MAX_IMPORT_BYTES } from "@/lib/export/share";
import { DecisionPreview } from "./decision-preview";
export function DecisionInput() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState<Decision[]>([]);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      setSaved(listScenarios());
      if (location.hash.startsWith("#scenario=")) {
        const imported = decodeShare(location.hash);
        // Imported links become a new local copy, never overwrite an existing scenario.
        imported.id = crypto.randomUUID();
        saveScenario(imported);
        history.replaceState(null, "", "/");
        router.push(`/scenario/${imported.id}`);
      }
    } catch { setError("We could not read your local data or that share link. Nothing was changed. Try importing a valid JSON backup."); }
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
    } catch { setError("Add a name and a dilemma that fit the limits, and make sure this browser allows local storage."); }
  }
  return <div className="site">
    <header className="site-header"><div className="container site-header-inner">
      <Brand />
      <nav className="site-nav" aria-label="Page sections"><a href="#how">How it works</a><a href="#new-decision">New decision</a><a href="#workbench">Workbench</a></nav>
      <a className="button button-outline header-source" href="https://github.com/marpusakethram/Timemachine">GitHub <ArrowUpRight size={14} /></a>
    </div></header>
    <main>
      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy">
          <span className="badge badge-brand"><span className="dot" />Decision modeling for early-stage teams</span>
          <h1>Move the assumptions. <span>See the runway.</span></h1>
          <p className="lead">Put your hiring, fundraising and growth bets side by side. Change one number and cash, runway and ownership update right away.</p>
          <div className="hero-ctas"><Button size="lg" onClick={() => create(true)}>Open the fictional SaaS demo <ArrowRight size={16} /></Button><a href="#new-decision" className="button button-outline button-lg">Model your own decision</a></div>
          <ul className="trust-list"><li><Check size={15} />Runs in your browser</li><li><Check size={15} />No account or bank login</li><li><Check size={15} />Open source, MIT</li></ul>
        </div>
        <DecisionPreview />
      </div></section>
      <section className="stat-band" aria-label="What you get"><div className="container stat-grid">
        <div><strong>3</strong><span>paths compared side by side</span></div>
        <div><strong>24</strong><span>months modeled month by month</span></div>
        <div><strong>15</strong><span>inputs you can edit and trace</span></div>
        <div><strong>0</strong><span>data sent anywhere by default</span></div>
      </div></section>
      <section className="section" id="how"><div className="container">
        <div className="section-intro"><span className="kicker">How it works</span><h2>From a gut call to a model your board can read.</h2><p>No spreadsheet setup. Pick a dilemma, tweak what you control, and share the math.</p></div>
        <div className="feature-grid">
          <article className="feature"><span className="feature-icon"><GitBranch size={18} /></span><span className="step">Step 1</span><h3>Frame three paths</h3><p>Start from a bootstrap, hire and raise template. Rename and reshape each path to match your real options.</p></article>
          <article className="feature"><span className="feature-icon"><SlidersHorizontal size={18} /></span><span className="step">Step 2</span><h3>Move the levers</h3><p>Every number is an editable assumption with units, limits and a tag showing where it came from.</p></article>
          <article className="feature"><span className="feature-icon"><ScanLine size={18} /></span><span className="step">Step 3</span><h3>Check the math</h3><p>See all 24 monthly rows, run a sensitivity grid, and export JSON, CSV or a PNG for the team.</p></article>
        </div>
      </div></section>
      <section className="section section-alt" id="new-decision"><div className="container create-grid">
        <div className="card create-card">
          <div className="card-head"><div><span className="kicker">New decision</span><h2>What are you deciding?</h2></div><span className="feature-icon"><GitBranch size={18} /></span></div>
          <form onSubmit={e => { e.preventDefault(); create(false); }}>
            <label className="field" htmlFor="title"><span className="field-name">Give it a name</span></label><input id="title" placeholder="Bootstrap or raise our first round?" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required />
            <label className="field" htmlFor="description"><span className="field-name">The dilemma</span><span className="counter">{description.length}/1500</span></label><textarea id="description" placeholder="We have a promising product and a small team. Should we stay lean, hire, or raise to buy more time?" value={description} onChange={e => setDescription(e.target.value)} maxLength={1500} required rows={4} />
            <div className="template-choice"><div><span className="kicker">Starter model</span><strong>Bootstrap vs raise</strong><small>Includes a hiring path. 24 month horizon.</small></div><Check size={18} /></div>
            <Button type="submit" size="lg" className="wide">Preview my decision <ArrowRight size={16} /></Button>
          </form>
          <p className="fine-print">You start with sample numbers and make them yours in the workspace.</p>
        </div>
        <div className="create-side">
          <span className="kicker">Private by default</span>
          <h2>Your numbers stay on your machine.</h2>
          <p>Scenarios are saved in this browser. No signup, no bank connection, no API key needed. Export a JSON backup whenever you want to move one.</p>
          <ul className="check-list"><li><Lock size={16} /><span><strong>Local storage only.</strong> Nothing leaves the browser unless you export or share it.</span></li><li><ScanLine size={16} /><span><strong>Transparent math.</strong> Plain formulas, no hidden scoring or made up certainty.</span></li><li><Check size={16} /><span><strong>AI is opt in.</strong> Gemini suggestions only run when you turn them on and review them.</span></li></ul>
          <p className="fine-print">These are conditional models. Not forecasts and not financial advice.</p>
        </div>
      </div></section>
      <section className="section" id="workbench"><div className="container">
        {error && <p className="notice notice-error" role="alert">{error}</p>}
        <div className="card table-card">
          <div className="table-card-head"><div><h2>Workbench</h2><p>Saved in this browser. Export a backup to take scenarios with you.</p></div><Button variant="outline" onClick={() => file.current?.click()}><FileUp size={16} />Import JSON</Button></div>
          <input ref={file} hidden type="file" accept=".json,application/json" onChange={async e => {
            try {
              const f = e.target.files?.[0]; if (!f) return;
              if (f.size > MAX_IMPORT_BYTES) throw new Error("File too large.");
              const d = importScenario(await f.text()); d.id = crypto.randomUUID(); d.updatedAt = metadata("entered", "").lastEdited;
              saveScenario(d); router.push(`/scenario/${d.id}`);
            } catch { setError("Invalid or oversized JSON. Import a Time Machine v1 export (100 KB max). Nothing was overwritten."); }
            e.target.value = "";
          }} />
          {!saved.length ? <div className="empty-state"><GitBranch size={22} /><p><strong>No saved decisions yet.</strong> Open the demo or start your own to see it here.</p><a href="#new-decision" className="button button-outline">Start a decision <ArrowRight size={14} /></a></div>
            : <div className="table-scroll"><table className="data-table"><thead><tr><th scope="col">Decision</th><th scope="col">Paths</th><th scope="col">Last updated</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>{saved.map(s => <tr key={s.id}>
              <td><Link href={`/scenario/${s.id}`} className="row-link">{s.title}</Link></td>
              <td>{s.branches.map(b => b.name).join(", ")}</td>
              <td>{new Date(s.updatedAt).toLocaleDateString()}</td>
              <td className="row-actions"><Link href={`/scenario/${s.id}`} className="button button-ghost button-sm">Open <ArrowUpRight size={14} /></Link><Button variant="ghost" size="sm" aria-label={`Delete ${s.title}`} onClick={() => {
                if (!confirm("Delete this local scenario? Export a backup first if you need it.")) return;
                try { removeScenario(s.id); setSaved(listScenarios()); } catch { setError("Could not remove the scenario from browser storage."); }
              }}><Trash2 size={15} /></Button></td>
            </tr>)}</tbody></table></div>}
        </div>
      </div></section>
    </main>
    <footer className="site-footer"><div className="container site-footer-inner"><span>Time Machine. Model the trade-off before you commit.</span><span>No bank connections. No market feeds. Just your numbers.</span></div></footer>
  </div>;
}
