import { AlertTriangle, Eye, FlaskConical, ListChecks } from "lucide-react";
import { Branch, Decision, SimulationResult } from "@/lib/simulation/models";
import { money } from "./scenario-comparison";
export function EvidenceDrawer({ decision, branch, result }: { decision: Decision; branch: Branch; result: SimulationResult }) {
  return <aside className="evidence card"><div className="card-head"><div><span className="kicker">Path brief</span><h2>{branch.name}</h2></div></div>
    <p>{branch.thesis}</p><p className="fine-print">This is the starting hypothesis. Your current inputs drive the numbers.</p>
    <h3><ListChecks size={14} />What you control</h3><ul>{branch.actions.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <h3 className="risk"><AlertTriangle size={14} />What could break</h3><ul>{branch.risks.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <h3><Eye size={14} />Watch for</h3><ul>{branch.signals.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <h3><FlaskConical size={14} />Next experiment</h3><ul>{branch.experiments.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <details><summary>Model details</summary><dl className="detail-metrics">
      <div><dt>Minimum cash</dt><dd>{money(result.minimumCash, decision.baseline.currency)}</dd></div>
      <div><dt>Month 12 revenue</dt><dd>{money(result.revenue12, decision.baseline.currency)}</dd></div>
      <div><dt>Gross margin</dt><dd>{result.grossMargin}%</dd></div>
      <div><dt>New investor stake</dt><dd>{result.investorOwnership === null ? "Unknown" : `${result.investorOwnership.toFixed(1)}%`}</dd></div>
      <div><dt>Month 24 customers</dt><dd>{Math.round(result.rows[23].customers).toLocaleString()}</dd></div>
    </dl>{result.founderOwnership === null && <p className="fine-print">Dilution is hidden because pre-money valuation is unknown (0).</p>}
    <p className="fine-print">Simple priced round. No SAFEs, preferences, option pools or later rounds. Customer counts use the same growth and churn factor as revenue.</p>
    <h3>Sources</h3>{decision.sources.map((s, i) => <p className="fine-print" key={i}>{s.kind}: {s.label}</p>)}
    <p className="fine-print mono">Engine {result.engine_version} · input {result.inputHash}<br />Calculated {result.timestamp}</p></details>
  </aside>;
}
