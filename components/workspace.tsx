"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Download, ImageDown, Pencil, RotateCcw, Save, Share2, Sparkles, X } from "lucide-react";
import { Decision, Field, Metadata, metadata, Values, fields } from "@/lib/simulation/models";
import { listScenarios, saveScenario } from "@/lib/storage/scenario-store";
import { resolveValues, simulate } from "@/lib/simulation/engine";
import { csv, download, encodeShare } from "@/lib/export/share";
import { Candidate, parseCandidate } from "@/lib/ai/schema";
import { templateBranches } from "@/lib/sample";
import { AssumptionEditor } from "./assumption-editor";
import { BranchGraph, COLORS, PATH_LETTERS } from "./branch-graph";
import { Brand } from "./brand";
import { CashChart, KpiStrip, ScenarioComparison, Sensitivity } from "./scenario-comparison";
import { EvidenceDrawer } from "./evidence-drawer";
import { Button } from "./ui/button";
type Pending = { candidate: Candidate; model: string; cached: boolean };
export function Workspace({ id }: { id: string }) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");
  const [baselineMode, setBaselineMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const [narrativeOnly, setNarrativeOnly] = useState(false);
  const capture = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // localStorage only exists after hydration, so the first read has to happen here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { setDecision(listScenarios().find(s => s.id === id) || null); }
    catch { setNotice("Local data could not be read. Import a valid backup from the home page."); }
    setLoaded(true);
  }, [id]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const values = useMemo(() => decision?.branches.map(b => resolveValues(decision.baseline.values, b)) || [], [decision]);
  const results = useMemo(() => values.map(v => simulate(v)), [values]);
  if (!loaded) return <main className="state-page" aria-busy="true"><div className="skeleton" /><p>Opening your local decision…</p></main>;
  if (!decision) return <main className="state-page"><span className="badge">Not found</span><h1>This scenario isn&apos;t in this browser.</h1><p>{notice || "Saved scenarios stay on the device that made them. Use a JSON export or a share link to move one."}</p><div className="state-actions"><Link className="button button-primary" href="/">Back to your decisions</Link></div></main>;
  const d = decision;
  const branch = d.branches[selected];
  const edit = (next: Decision) => { setDecision({ ...next, updatedAt: new Date().toISOString() }); setDirty(true); };
  const save = () => {
    try { saveScenario(d); setDirty(false); setNotice("Saved in this browser. Export JSON if you want a portable backup."); }
    catch (e) { setNotice(e instanceof Error ? e.message : "Save failed. Export JSON to keep your changes."); }
  };
  const editNumber = (name: Field, value: number) => {
    if (baselineMode) edit({ ...d, baseline: { ...d.baseline, values: { ...d.baseline.values, [name]: value }, metadata: { ...d.baseline.metadata, [name]: metadata("entered", "Edited by you in the baseline.") } } });
    else edit({ ...d, branches: d.branches.map((b, i) => i !== selected ? b : { ...b, overrides: { ...b.overrides, [name]: value }, metadata: { ...b.metadata, [name]: metadata("entered", "Edited by you for this branch.") } }) });
  };
  async function generate() {
    setBusy(true); setNotice(""); setPending(null); setReviewed(false);
    try {
      const response = await fetch("/api/scenarios/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: d.title, description: d.description, values: d.baseline.values, consent }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed.");
      setPending({ candidate: parseCandidate(data.candidate), model: data.model, cached: data.cached });
      setNotice("Candidate assumptions are ready. Review them below before you apply anything.");
    } catch (e) { setNotice(`${e instanceof Error ? e.message : "Generation unavailable."} The three local branches remain available.`); }
    finally { setBusy(false); }
  }
  function applyCandidate() {
    if (!pending || !reviewed) return;
    edit({
      ...d, generation: { model: pending.model, cached: pending.cached, at: new Date().toISOString() },
      sources: [...d.sources.filter(s => s.kind !== "model"), { kind: "model", label: "Generated with AI. Assumptions unverified; reviewed by user, not empirically validated" }],
      branches: d.branches.map((old, i) => {
        const c = pending.candidate.branches[i];
        const overrides: Partial<Values> = narrativeOnly ? { ...old.overrides } : {};
        const meta: Partial<Record<Field, Metadata>> = narrativeOnly ? { ...old.metadata } : {};
        if (!narrativeOnly) {
          c.assumptions.forEach(a => { overrides[a.field] = a.value; meta[a.field] = metadata("inferred", a.explanation); });
          // Explicit user edits always win over model suggestions.
          (Object.keys(old.overrides) as Field[]).forEach(k => {
            if (old.metadata[k]?.provenance === "entered") { overrides[k] = old.overrides[k]; meta[k] = old.metadata[k]; }
          });
        }
        return { ...old, name: c.name, thesis: c.thesis, actions: c.actions, risks: c.risks, signals: c.signals, experiments: c.experiments, overrides, metadata: meta, reviewed: true };
      }),
    });
    setPending(null); setNotice("Reviewed candidates applied. Numbers you edited yourself were kept.");
  }
  const color = COLORS[selected];
  const guard = (e: React.MouseEvent) => { if (dirty && !confirm("Leave with unsaved changes? Save first to keep your edits.")) e.preventDefault(); };
  return <div className="app">
    <header className="app-header"><div className="app-header-inner">
      <Brand onClick={guard} />
      <nav className="breadcrumb" aria-label="Breadcrumb"><ChevronRight size={14} /><Link href="/" onClick={guard}>Your decisions</Link><ChevronRight size={14} /><span aria-current="page">{d.title || "Untitled decision"}</span></nav>
      <div className="top-actions"><span className={`save-state${dirty ? " dirty" : ""}`}><span className="dot" />{dirty ? "Unsaved changes" : "Saved in this browser"}</span><Button size="sm" onClick={save}><Save size={15} />Save</Button></div>
    </div></header>
    <main className="workspace">
      <div className="page-head">
        <div className="page-title"><div className="tag-row"><span className="badge">Hypothetical</span><span className="badge">{d.baseline.currency}</span><span className="badge">24 months</span></div><h1>{d.title}</h1><p>{d.description}</p></div>
        <div className="export-group" role="group" aria-label="Export">
          <Button variant="outline" size="sm" onClick={() => { try { download("timemachine.json", JSON.stringify(Decision.parse(d), null, 2), "application/json"); setNotice("JSON exported with inputs, provenance and model versions."); } catch { setNotice("Fix the title and description before exporting."); } }}><Download size={14} />JSON</Button>
          <Button variant="outline" size="sm" onClick={() => download("timemachine-monthly.csv", csv(results[selected]), "text/csv")}><Download size={14} />CSV</Button>
          <Button variant="outline" size="sm" onClick={async () => {
            try {
              if (!capture.current) return;
              const { toPng } = await import("html-to-image");
              const url = await toPng(capture.current, { backgroundColor: "#ffffff", pixelRatio: 1, filter: node => !(node instanceof Element && node.classList.contains("react-flow__attribution")) });
              const a = document.createElement("a"); a.href = url; a.download = "timemachine.png"; a.click(); setNotice("PNG snapshot exported.");
            } catch { setNotice("PNG export failed in this browser. Take a browser screenshot or export JSON instead."); }
          }}><ImageDown size={14} />PNG</Button>
          <Button variant="outline" size="sm" onClick={async () => {
            if (!confirm("The share link holds your full scenario, including the title and numbers. Anyone with it can read them. Don't share secrets or personal data. Continue?")) return;
            try { const url = location.origin + "/" + encodeShare(d); await navigator.clipboard.writeText(url); setNotice("Share link copied. On another machine, swap the localhost part for that person's app address."); }
            catch (e) { setNotice(e instanceof Error ? e.message : "Could not copy the link. Export JSON instead."); }
          }}><Share2 size={14} />Share</Button>
        </div>
      </div>
      <details className="decision-edit card"><summary><Pencil size={14} />Edit name, dilemma and currency</summary><div className="decision-edit-body"><label>Title<input aria-label="Decision title" maxLength={120} value={d.title} onChange={e => edit({ ...d, title: e.target.value })} /></label><label>Description<textarea aria-label="Decision description" maxLength={1500} value={d.description} onChange={e => edit({ ...d, description: e.target.value })} /></label><label>Currency <select value={d.baseline.currency} onChange={e => edit({ ...d, baseline: { ...d.baseline, currency: e.target.value as Decision["baseline"]["currency"] } })}>{["USD", "EUR", "GBP", "INR"].map(c => <option key={c}>{c}</option>)}</select></label><p className="fine-print">Changing currency only relabels amounts. It does not convert them.</p></div></details>
      {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16} /></button></div>}
      {d.generation && <p className="ai-label"><Sparkles size={14} />Generated with AI, assumptions unverified. Model: {d.generation.model}</p>}
      <div className="capture" ref={capture}>
        <div className="branch-switch" aria-label="Select branch">{d.branches.map((b, i) => <button key={b.id} aria-pressed={selected === i} onClick={() => setSelected(i)} style={{ "--branch-color": COLORS[i] } as React.CSSProperties}><span>{PATH_LETTERS[i]}</span> {b.name}</button>)}</div>
        <KpiStrip branch={branch} result={results[selected]} currency={d.baseline.currency} color={color} />
        <div className="workspace-grid">
          <aside className="assumptions card"><div className="card-head"><h2>Assumptions</h2></div>
            <div className="segmented"><button aria-pressed={!baselineMode} onClick={() => setBaselineMode(false)}>Selected path</button><button aria-pressed={baselineMode} onClick={() => setBaselineMode(true)}>Baseline</button></div>
            <p className="fine-print">{baselineMode ? "Baseline changes flow into every path that has no override." : `Editing ${branch.name}. Changes only affect this path.`}</p>
            <AssumptionEditor values={baselineMode ? d.baseline.values : values[selected]} metadata={{ ...d.baseline.metadata, ...(baselineMode ? {} : branch.metadata) }} onChange={editNumber} />
            {!baselineMode && <Button variant="ghost" className="wide" onClick={() => {
              if (!confirm("Reset this path's numbers to the current baseline?")) return;
              edit({ ...d, branches: d.branches.map((b, i) => i === selected ? { ...b, overrides: {}, metadata: {} } : b) });
            }}><RotateCcw size={14} />Reset path to baseline</Button>}
          </aside>
          <div className="model-main">
            <CashChart branches={d.branches} results={results} currency={d.baseline.currency} selected={selected} startingCash={values.map(v => v.cash)} />
            <ScenarioComparison branches={d.branches} results={results} currency={d.baseline.currency} selected={selected} onSelect={setSelected} />
            <section className="card graph-card"><div className="card-head"><div><h2>Decision map</h2><p className="card-sub">One question, three ways it could go.</p></div></div><BranchGraph title={d.title} branches={d.branches} selected={selected} onSelect={setSelected} /></section>
            <Sensitivity values={values[selected]} currency={d.baseline.currency} />
          </div>
          <EvidenceDrawer decision={d} branch={branch} result={results[selected]} />
        </div>
      </div>
      <section className="ai-panel card"><div><span className="badge badge-ai"><Sparkles size={12} />Optional, uses Gemini</span><h2>Get a second opinion on the numbers</h2><p>Gemini suggests three paths with its own numbers. You review every one before anything changes. The model works fine without it.</p><p className="fine-print">Only the dilemma and baseline numbers are sent. Free tier inputs may be used to improve Google products. Don&apos;t send private documents, secrets, credentials or confidential business info.</p></div>
        <div className="ai-controls"><label className="checkbox"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />This is non-confidential data and I agree to send it to Gemini.</label><label className="checkbox"><input type="checkbox" checked={narrativeOnly} onChange={e => setNarrativeOnly(e.target.checked)} />Regenerate the narrative only and keep all numbers</label><div className="button-row"><Button disabled={!consent || busy || !d.title.trim() || !d.description.trim()} onClick={generate}><Sparkles size={15} />{busy ? "Generating candidates…" : "Generate candidates"}</Button><Button variant="outline" onClick={() => {
          if (!confirm("Replace all three paths with the local template? Your path edits will be replaced.")) return;
          edit({ ...d, branches: templateBranches(), generation: undefined, sources: d.sources.filter(s => s.kind !== "model") }); setSelected(0); setPending(null); setNotice("Local template applied. All numbers are hypothetical.");
        }}>Use local template</Button></div></div>
      </section>
      {pending && <section className="review-panel card"><span className="badge badge-ai">Review before applying</span><h2>Suggestions, not facts</h2><p>Numbers you edited yourself always win. {narrativeOnly && "Only the narrative will be applied."}</p>
        {pending.candidate.warnings.map((w, i) => <p key={i} className="notice notice-warn">{w}</p>)}
        <div className="review-grid">{pending.candidate.branches.map((b, i) => <div key={i} className="review-item"><h3>{b.name}</h3><p>{b.thesis}</p>{b.assumptions.map((a, j) => <label key={a.field} className="candidate-number">{fields[a.field].label} ({fields[a.field].unit})<input type="number" min={fields[a.field].min} max={fields[a.field].max} step="any" value={a.value} onChange={e => {
          const value = Number(e.target.value), f = fields[a.field];
          if (!e.target.value || !Number.isFinite(value) || value < f.min || value > f.max || ((f.unit === "month" || a.field === "customers") && !Number.isInteger(value))) return;
          setPending({ ...pending, candidate: { ...pending.candidate, branches: pending.candidate.branches.map((cb, bi) => bi !== i ? cb : { ...cb, assumptions: cb.assumptions.map((ca, ai) => ai !== j ? ca : { ...ca, value }) }) } }); setReviewed(false);
        }} /><small>{a.explanation}</small></label>)}</div>)}</div>
        <label className="checkbox"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />I reviewed these inferred assumptions and understand they are hypothetical.</label><div className="button-row"><Button onClick={applyCandidate} disabled={!reviewed}><Check size={15} />Apply reviewed candidates</Button><Button variant="ghost" onClick={() => setPending(null)}>Discard</Button></div>
      </section>}
      <details className="card monthly-table"><summary>Monthly rows <span>All 24 months for {branch.name}</span></summary><div className="table-scroll"><table className="data-table numeric"><thead><tr>{["Month", "Revenue", "COGS", "OpEx", "Operating CF", "Financing", "Capex", "Ending cash"].map(k => <th key={k}>{k}</th>)}</tr></thead><tbody>{results[selected].rows.map(r => <tr key={r.month}>{[r.month, r.revenue, r.cogs, r.expenses, r.operatingCashFlow, r.financing, r.capex, r.cash].map((v, i) => <td key={i} className={i === 7 && v < 0 ? "negative" : ""}>{i === 0 ? v : v.toLocaleString("en", { maximumFractionDigits: 2 })}</td>)}</tr>)}</tbody></table></div></details>
    </main>
    <footer className="app-footer"><span>Engine {d.engine_version} / schema {d.schema_version}</span><span>Hypothetical models. Not forecasts or financial advice.</span></footer>
  </div>;
}
