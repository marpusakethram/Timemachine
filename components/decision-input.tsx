"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileUp, GitBranch, Lock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { sampleDecision } from "@/lib/sample";
import { Decision, metadata } from "@/lib/simulation/models";
import { listScenarios, removeScenario, saveScenario } from "@/lib/storage/scenario-store";
import { decodeShare, importScenario, MAX_IMPORT_BYTES } from "@/lib/export/share";
import { DecisionPreview } from "./decision-preview";
export function Brand() {
  return <><span className="brand-mark" aria-hidden="true">TM</span>Time Machine</>;
}
const steps = [
  ["Frame the decision", "Name the dilemma. You start from a fictional SaaS baseline you can overwrite."],
  ["Pick a path", "Bootstrap, hire or raise. Each path only overrides the numbers it changes."],
  ["Move a lever", "Drag capital, growth or spend. Runway and ownership recalculate on every change."],
  ["Take it with you", "Export JSON, a 24-row CSV, a PNG or a share link. Nothing is stored on a server."],
];
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
    } catch { setError("Could not read local data or the share link. Your saved data was not changed. Import a valid JSON backup."); }
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
    } catch { setError("Enter a title and dilemma within the limits, and allow browser storage to save your scenario."); }
  }
  return <main className="site">
    <header className="nav"><Link href="/" className="brand"><Brand /></Link><nav aria-label="Page sections"><a href="#method">How it works</a><a href="#workbench">Your decisions</a><a href="https://github.com/marpusakethram/Timemachine">Source <ArrowUpRight size={13} /></a></nav></header>
    <section className="hero">
      <div className="hero-copy">
        <h1>Don&rsquo;t guess. Move the assumptions.</h1>
        <p className="lede">Model runway, burn and founder dilution across three paths, side by side. Everything runs in your browser.</p>
        <div className="hero-ctas"><Button onClick={() => create(true)}>Open the fictional SaaS demo</Button><a href="#new-decision" className="text-link">Model your own decision <ArrowRight size={15} /></a></div>
      </div>
      <DecisionPreview />
    </section>
    <section className="facts" aria-label="What you get">
      <p><strong>No account</strong>Scenarios live in this browser.</p>
      <p><strong>No API key</strong>The simulator is fully local.</p>
      <p><strong>24 months</strong>Monthly cash, revenue and burn.</p>
      <p><strong>MIT licensed</strong>Read every formula on GitHub.</p>
    </section>
    <section className="method" id="method">
      <div className="method-math">
        <h2>The math is on the page.</h2>
        <p>No black box and no invented confidence. These are the equations the engine runs every month, and you can check them by hand.</p>
        <pre aria-label="Core equations"><code>{`revenue[t]  = revenue[t-1] × (1 + growth) × (1 - churn)
cash[t]     = cash[t-1] + gross_profit[t] - opex[t]
              + financing[t] - capex[t]
founder_after = founder_before × pre / (pre + raise)`}</code></pre>
      </div>
      <ol className="steps">{steps.map(([name, body]) => <li key={name}><strong>{name}</strong><span>{body}</span></li>)}</ol>
    </section>
    <section className="create" id="new-decision">
      <div className="create-copy">
        <h2>Start with your own dilemma.</h2>
        <p>Hiring changes your burn. Raising changes your stake. Growth changes your runway. Put all three on one page before you commit.</p>
        <p className="privacy"><Lock size={16} /><span>Saved in this browser only. No bank connection, no upload, no API key.</span></p>
      </div>
      <form className="form-panel" onSubmit={e => { e.preventDefault(); create(false); }}>
        <div className="field"><label htmlFor="title">Give it a name</label><input id="title" placeholder="Bootstrap or raise our first round?" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required /></div>
        <div className="field"><label htmlFor="description">The dilemma <span>{description.length}/1500</span></label><textarea id="description" placeholder="We have a promising product and a small team. Should we stay lean, hire, or raise to buy more time?" value={description} onChange={e => setDescription(e.target.value)} maxLength={1500} required rows={4} /></div>
        <div className="template-choice"><GitBranch size={18} /><span><strong>Bootstrap vs Raise</strong><small>Starter model with a hiring path, 24 months</small></span></div>
        <Button type="submit" className="wide">Preview my decision</Button>
        <p className="hint">Starts with sample numbers. Make them yours in the workspace.</p>
      </form>
    </section>
    {error && <p className="notice error" role="alert">{error}</p>}
    <section className="workbench" id="workbench">
      <div className="workbench-head"><div><h2>Your decisions</h2><p>Stored in this browser. Export a backup to move them.</p></div><Button variant="outline" onClick={() => file.current?.click()}><FileUp size={16} />Import JSON</Button><input ref={file} hidden type="file" accept=".json,application/json" onChange={async e => {
        try {
          const f = e.target.files?.[0]; if (!f) return;
          if (f.size > MAX_IMPORT_BYTES) throw new Error("File too large.");
          const d = importScenario(await f.text()); d.id = crypto.randomUUID(); d.updatedAt = metadata("entered", "").lastEdited;
          saveScenario(d); router.push(`/scenario/${d.id}`);
        } catch { setError("Invalid or oversized JSON. Import a Time Machine v1 export (100 KB max). Nothing was overwritten."); }
        e.target.value = "";
      }} /></div>
      {!saved.length && <div className="empty"><p>No saved decisions yet.</p><a href="#new-decision">Start with a dilemma <ArrowRight size={14} /></a></div>}
      {!!saved.length && <ul className="saved-list">{saved.map(s => <li key={s.id}><Link href={`/scenario/${s.id}`}><strong>{s.title}</strong><span>Edited {new Date(s.updatedAt).toLocaleDateString()}</span></Link><Button variant="ghost" aria-label={`Delete ${s.title}`} onClick={() => {
        if (!confirm("Delete this local scenario? Export a backup first if you need it.")) return;
        try { removeScenario(s.id); setSaved(listScenarios()); } catch { setError("Could not remove the scenario from browser storage."); }
      }}><Trash2 size={16} /></Button></li>)}</ul>}
    </section>
    <footer><span>Time Machine</span><span>Conditional models, not forecasts or financial advice.</span></footer>
  </main>;
}
