"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock3, Download, ImageDown, RotateCcw, Save, Share2, Sparkles } from "lucide-react";
import { Decision, Field, Metadata, metadata, Values, fields } from "@/lib/simulation/models";
import { listScenarios, saveScenario } from "@/lib/storage/scenario-store";
import { resolveValues, simulate } from "@/lib/simulation/engine";
import { csv, download, encodeShare } from "@/lib/export/share";
import { Candidate, parseCandidate } from "@/lib/ai/schema";
import { templateBranches } from "@/lib/sample";
import { AssumptionEditor } from "./assumption-editor";
import { BranchGraph } from "./branch-graph";
import { CashChart, ScenarioComparison, Sensitivity } from "./scenario-comparison";
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
  if (!loaded) return <main className="loading" aria-busy="true"><div className="skeleton" /><p>Opening your local decision…</p></main>;
  if (!decision) return <main className="loading"><h1>Scenario not found in this browser.</h1><p>{notice || "Saved scenarios stay on the device that created them. Use a JSON export or share link to transfer one."}</p><Link href="/">Back to workbench</Link></main>;
  const d = decision;
  const branch = d.branches[selected];
  const edit = (next: Decision) => { setDecision({ ...next, updatedAt: new Date().toISOString() }); setDirty(true); };
  const save = () => {
    try { saveScenario(d); setDirty(false); setNotice("Saved in this browser. Export JSON for a portable backup."); }
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
      setNotice("Candidate assumptions are ready. Review them below before applying.");
    } catch (e) { setNotice(`${e instanceof Error ? e.message : "Generation unavailable."} The three local branches remain available.`); }
    finally { setBusy(false); }
  }
  function applyCandidate() {
    if (!pending || !reviewed) return;
    edit({
      ...d, generation: { model: pending.model, cached: pending.cached, at: new Date().toISOString() },
      sources: [...d.sources.filter(s => s.kind !== "model"), { kind: "model", label: "Generated with AI — assumptions unverified; reviewed by user, not empirically validated" }],
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
    setPending(null); setNotice("Reviewed candidates applied. Your explicitly edited numbers were preserved.");
  }
  return <main className="workspace">
    <header className="topbar"><Link href="/" onClick={e => { if (dirty && !confirm("Leave with unsaved changes? Save first to keep your edits.")) e.preventDefault(); }} className="brand"><span className="brand-icon"><Clock3 size={20} /></span>time<span>machine</span></Link><div className="top-actions"><span className="save-state">{dirty ? "Unsaved changes" : "Saved locally"}</span><Button variant="outline" onClick={save}><Save size={15} />Save</Button></div></header>
    <div className="workspace-heading"><div><Link href="/" className="back-link" onClick={e => { if (dirty && !confirm("Leave with unsaved changes?")) e.preventDefault(); }}><ArrowLeft size={14} />Workbench</Link><h1>{d.title}</h1><p>{d.description}</p></div><span className="pill"><span className="status-dot" />Hypothetical · {d.baseline.currency}</span></div>
    <details className="decision-edit"><summary>Edit dilemma & baseline currency</summary><label>Title<input aria-label="Decision title" maxLength={120} value={d.title} onChange={e => edit({ ...d, title: e.target.value })} /></label><label>Description<textarea aria-label="Decision description" maxLength={1500} value={d.description} onChange={e => edit({ ...d, description: e.target.value })} /></label><label>Currency <select value={d.baseline.currency} onChange={e => edit({ ...d, baseline: { ...d.baseline, currency: e.target.value as Decision["baseline"]["currency"] } })}>{["USD", "EUR", "GBP", "INR"].map(c => <option key={c}>{c}</option>)}</select></label><p className="small">Changing currency relabels amounts; it does not perform foreign exchange conversion.</p></details>
    {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}
    {d.generation && <p className="ai-label">Generated with AI — assumptions unverified · {d.generation.model}</p>}
    <div className="workspace-grid" ref={capture}>
      <aside className="assumptions panel"><div className="section-heading"><div><span className="eyebrow">THE LEVERS</span><h2>Change the inputs.</h2></div></div>
        <div className="segmented"><button aria-pressed={!baselineMode} onClick={() => setBaselineMode(false)}>Selected branch</button><button aria-pressed={baselineMode} onClick={() => setBaselineMode(true)}>Baseline</button></div>
        <p className="small muted">{baselineMode ? "Baseline changes flow into branches without overrides." : `${branch.name} · overrides only this path.`}</p>
        <AssumptionEditor values={baselineMode ? d.baseline.values : values[selected]} metadata={{ ...d.baseline.metadata, ...(baselineMode ? {} : branch.metadata) }} onChange={editNumber} />
        {!baselineMode && <Button variant="ghost" className="wide" onClick={() => {
          if (!confirm("Reset this branch's numbers to the current baseline?")) return;
          edit({ ...d, branches: d.branches.map((b, i) => i === selected ? { ...b, overrides: {}, metadata: {} } : b) });
        }}><RotateCcw size={14} />Reset branch to baseline</Button>}
      </aside>
      <div className="model-main"><section className="graph-panel panel"><div className="section-heading"><span className="eyebrow">YOUR DECISION SPACE</span><span className="small muted">Three conditional paths</span></div><BranchGraph title={d.title} branches={d.branches} selected={selected} onSelect={setSelected} /><div className="branch-tabs" aria-label="Select branch">{d.branches.map((b, i) => <button key={b.id} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>0{i + 1}</span>{b.name}</button>)}</div></section>
        <CashChart branches={d.branches} results={results} currency={d.baseline.currency} selected={selected} startingCash={values.map(v => v.cash)} />
        <ScenarioComparison branches={d.branches} results={results} currency={d.baseline.currency} selected={selected} onSelect={setSelected} />
        <Sensitivity values={values[selected]} currency={d.baseline.currency} />
      </div>
      <EvidenceDrawer decision={d} branch={branch} result={results[selected]} />
    </div>
    <section className="ai-panel panel"><div><span className="eyebrow">OPTIONAL / GEMINI</span><h2>A second set of assumptions.</h2><p className="muted">Generate candidate pathways, then review them. The local simulator works without AI.</p><p className="small">Only the dilemma and baseline are sent. Free-tier inputs may be used to improve Google products. Do not submit private documents, secrets, credentials or confidential business information.</p></div>
      <div className="ai-controls"><label className="checkbox"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />This is non-confidential data and I agree to send it to Gemini.</label><label className="checkbox"><input type="checkbox" checked={narrativeOnly} onChange={e => setNarrativeOnly(e.target.checked)} />Regenerate narrative only; keep all numbers</label><Button disabled={!consent || busy || !d.title.trim() || !d.description.trim()} onClick={generate}><Sparkles size={16} />{busy ? "Generating candidates…" : "Generate candidates"}</Button><Button variant="outline" onClick={() => {
        if (!confirm("Replace all three branches with the local template? Existing branch edits will be replaced.")) return;
        edit({ ...d, branches: templateBranches(), generation: undefined, sources: d.sources.filter(s => s.kind !== "model") }); setSelected(0); setPending(null); setNotice("Local template applied. All numbers are hypothetical.");
      }}>Use local template</Button></div>
    </section>
    {pending && <section className="review-panel panel"><span className="eyebrow">REVIEW BEFORE APPLYING</span><h2>Inferred candidates, not verified facts.</h2><p className="muted">Your explicitly edited branch numbers take priority. {narrativeOnly && "Only narrative will be applied."}</p>
      {pending.candidate.warnings.map((w, i) => <p key={i} className="notice">{w}</p>)}
      <div className="comparison-grid">{pending.candidate.branches.map((b, i) => <div key={i}><h3>{b.name}</h3><p>{b.thesis}</p>{b.assumptions.map((a, j) => <label key={a.field} className="candidate-number">{fields[a.field].label} ({fields[a.field].unit})<input type="number" min={fields[a.field].min} max={fields[a.field].max} step="any" value={a.value} onChange={e => {
        const value = Number(e.target.value), f = fields[a.field];
        if (!e.target.value || !Number.isFinite(value) || value < f.min || value > f.max || ((f.unit === "month" || a.field === "customers") && !Number.isInteger(value))) return;
        setPending({ ...pending, candidate: { ...pending.candidate, branches: pending.candidate.branches.map((cb, bi) => bi !== i ? cb : { ...cb, assumptions: cb.assumptions.map((ca, ai) => ai !== j ? ca : { ...ca, value }) }) } }); setReviewed(false);
      }} /><small>{a.explanation}</small></label>)}</div>)}</div>
      <label className="checkbox"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />I reviewed these inferred assumptions and understand they are hypothetical.</label><Button onClick={applyCandidate} disabled={!reviewed}><Check size={16} />Apply reviewed candidates</Button><Button variant="ghost" onClick={() => setPending(null)}>Discard</Button>
    </section>}
    <section className="export-bar"><div><h2>Take the model with you.</h2><p className="small muted">Portable inputs. Reproducible outputs. No account required.</p></div><div className="export-buttons">
      <Button variant="outline" onClick={() => { try { download("timemachine.json", JSON.stringify(Decision.parse(d), null, 2), "application/json"); setNotice("JSON exported with inputs, provenance and model versions."); } catch { setNotice("Fix the title and description before exporting."); } }}><Download size={15} />JSON</Button>
      <Button variant="outline" onClick={() => download("timemachine-monthly.csv", csv(results[selected]), "text/csv")}><Download size={15} />CSV</Button>
      <Button variant="outline" onClick={async () => {
        try {
          if (!capture.current) return;
          const { toPng } = await import("html-to-image");
          const url = await toPng(capture.current, { backgroundColor: "#0c1421", pixelRatio: 1, filter: node => !(node instanceof Element && node.classList.contains("react-flow__attribution")) });
          const a = document.createElement("a"); a.href = url; a.download = "timemachine.png"; a.click(); setNotice("PNG snapshot exported.");
        } catch { setNotice("PNG export failed in this browser. Use a browser screenshot or export JSON."); }
      }}><ImageDown size={15} />PNG</Button>
      <Button variant="outline" onClick={async () => {
        if (!confirm("The share link contains your full scenario, including title and numbers. Anyone with it can read them. Do not share secrets or personal data. Continue?")) return;
        try { const url = location.origin + "/" + encodeShare(d); await navigator.clipboard.writeText(url); setNotice("Share link copied. On another machine, replace the localhost origin with that user's app address."); }
        catch (e) { setNotice(e instanceof Error ? e.message : "Could not copy link. Export JSON instead."); }
      }}><Share2 size={15} />Share</Button></div>
    </section>
    <details className="monthly-table"><summary>Inspect the 24 monthly rows</summary><div className="table-scroll"><table><thead><tr>{["Month", "Revenue", "COGS", "OpEx", "Operating CF", "Financing", "Capex", "Ending cash"].map(k => <th key={k}>{k}</th>)}</tr></thead><tbody>{results[selected].rows.map(r => <tr key={r.month}>{[r.month, r.revenue, r.cogs, r.expenses, r.operatingCashFlow, r.financing, r.capex, r.cash].map((v, i) => <td key={i}>{i === 0 ? v : v.toLocaleString("en", { maximumFractionDigits: 2 })}</td>)}</tr>)}</tbody></table></div></details>
    <footer><span>ENGINE {d.engine_version} / SCHEMA {d.schema_version}</span><span>Hypothetical models. Not forecasts or financial advice.</span></footer>
  </main>;
}
