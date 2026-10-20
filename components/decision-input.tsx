"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3, FileUp, FlaskConical, GitBranch, Trash2, SlidersHorizontal, ScanLine, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
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
    } catch { setError("Could not read local data or share link. Your saved data was not changed. Import a valid JSON backup."); }
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
  return <main className="landing">
    <header className="topbar"><Link href="/" className="brand"><span className="brand-icon"><Clock3 size={21} /></span>time<span>machine</span><sup>LAB</sup></Link><nav className="landing-nav" aria-label="Page sections"><a href="#model">The model</a><a href="#workbench">Your decisions</a></nav><span className="pill"><span className="status-dot" />Local-first · no account</span><a className="nav-link" href="https://github.com/marpusakethram/Timemachine">Source <ArrowUpRight size={14} /></a></header>
    <div className="hero-grid">
      <section className="hero-copy"><span className="eyebrow"><span className="tiny-line" /> A DECISION LAB FOR FOUNDERS</span><h1>Don’t ask<br />what happens.<br /><span>Move the<br /><em>assumptions.</em></span></h1><p className="hero-description">The next move is yours.<br />See what it could mean for your cash, your runway, and the company you keep.</p>
        <div className="hero-ctas"><Button onClick={() => create(true)}>Open the fictional SaaS demo <ArrowUpRight size={16} /></Button><a href="#new-decision" className="text-action">Frame your decision <ArrowRight size={15} /></a></div>
        <div className="hero-footnote"><FlaskConical size={16} /><span>Hypothetical by design. Useful by making it explicit.</span></div>
      </section>
      <DecisionPreview />
    </div>
    <section className="model-principles" id="model" aria-label="How the model works">
      <div><GitBranch size={19} /><span><strong>Explore three paths</strong><small>Keep the trade-offs side by side.</small></span></div>
      <div><SlidersHorizontal size={19} /><span><strong>Move what you control</strong><small>Every number is an editable assumption.</small></span></div>
      <div><ScanLine size={19} /><span><strong>See the calculation</strong><small>Transparent math, no invented certainty.</small></span></div>
    </section>
    <section className="creation-section" id="new-decision">
      <div className="creation-copy"><span className="eyebrow">FROM “WHAT IF” TO “WHAT IT TAKES”</span><h2>A little more clarity.<br /><em>Before the commitment.</em></h2><p>Hiring changes your burn. Raising changes your ownership. Growth changes the runway. Put those assumptions on the same page.</p><div className="model-note"><ShieldCheck size={19} /><div><strong>Your decisions stay yours.</strong><p>Saved in this browser. No account, no bank connection, no API key required.</p></div></div><span className="small muted">Conditional models. Not forecasts or financial advice.</span></div>
      <section className="decision-card"><div className="card-top"><span className="eyebrow">01 / FRAME THE DECISION</span><GitBranch size={20} /></div><h2>What’s your next move?</h2><p className="muted">Start with a dilemma. Explore what would need to be true.</p>
        <form onSubmit={e => { e.preventDefault(); create(false); }}>
          <label htmlFor="title">Give it a name</label><input id="title" placeholder="Bootstrap or raise our first round?" value={title} onChange={e => setTitle(e.target.value)} maxLength={120} required />
          <label htmlFor="description">The dilemma <span>{description.length}/1500</span></label><textarea id="description" placeholder="We have a promising product and a small team. Should we stay lean, hire, or raise capital to buy more time?" value={description} onChange={e => setDescription(e.target.value)} maxLength={1500} required rows={4} />
          <div className="template-choice"><span>STARTER MODEL</span><strong>Bootstrap vs Raise</strong><small>Includes a hiring branch · 24 months</small></div>
          <Button type="submit" className="wide">Preview my decision <ArrowRight size={17} /></Button>
        </form>
        <p className="small muted centered">Starts with sample numbers. Make them yours in the workspace.</p>
      </section>
    </section>
    {error && <p className="notice error" role="alert">{error}</p>}
    <section className="landing-bottom" id="workbench"><div><span className="eyebrow">THE WORKBENCH</span><h2>Your decisions, kept here.</h2><p className="muted">Stored in this browser. Export a backup to take them with you.</p></div><Button variant="outline" onClick={() => file.current?.click()}><FileUp size={16} />Import JSON</Button><input ref={file} hidden type="file" accept=".json,application/json" onChange={async e => {
      try {
        const f = e.target.files?.[0]; if (!f) return;
        if (f.size > MAX_IMPORT_BYTES) throw new Error("File too large.");
        const d = importScenario(await f.text()); d.id = crypto.randomUUID(); d.updatedAt = metadata("entered", "").lastEdited;
        saveScenario(d); router.push(`/scenario/${d.id}`);
      } catch { setError("Invalid or oversized JSON. Import a Time Machine v1 export (maximum 100 KB). Nothing was overwritten."); }
      e.target.value = "";
    }} /></section>
    {!saved.length && <div className="empty-workbench"><GitBranch size={22} /><p>Room for your next decision.</p><a href="#new-decision">Start with a dilemma <ArrowRight size={14} /></a></div>}
    <div className="saved-grid">{saved.map(s => <article key={s.id} className="saved-card"><Link href={`/scenario/${s.id}`}><span className="eyebrow">SAVED SCENARIO</span><h3>{s.title}</h3><p>{new Date(s.updatedAt).toLocaleDateString()} <ArrowUpRight size={15} /></p></Link><Button variant="ghost" aria-label={`Delete ${s.title}`} onClick={() => {
      if (!confirm("Delete this local scenario? Export a backup first if you need it.")) return;
      try { removeScenario(s.id); setSaved(listScenarios()); } catch { setError("Could not remove the scenario from browser storage."); }
    }}><Trash2 size={16} /></Button></article>)}</div>
    <footer><span>TIME MACHINE / MODEL THE TRADE-OFF</span><span>No bank connections. No market feeds. Your numbers.</span></footer>
  </main>;
}
