import { Branch, Decision, SimulationResult } from "@/lib/simulation/models";
import { money } from "./scenario-comparison";
export function EvidenceDrawer({ decision, branch, result }: { decision: Decision; branch: Branch; result: SimulationResult }) {
  return <aside className="evidence panel"><span className="panel-label">Selected path</span><h2>{branch.name}</h2><p>{branch.thesis}</p><p className="small muted">This is the original hypothesis. Your current inputs drive the results.</p>
    <h3>Controllable actions</h3><ul>{branch.actions.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <h3>What could break</h3><ul>{branch.risks.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <h3>Watch for</h3><ul>{branch.signals.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <h3>Next experiment</h3><ul>{branch.experiments.map((r, i) => <li key={i}>{r}</li>)}</ul>
    <details><summary>Model evidence & details</summary><dl className="detail-metrics">
      <div><dt>Minimum cash</dt><dd>{money(result.minimumCash, decision.baseline.currency)}</dd></div>
      <div><dt>Month 12 revenue</dt><dd>{money(result.revenue12, decision.baseline.currency)}</dd></div>
      <div><dt>Gross margin</dt><dd>{result.grossMargin}%</dd></div>
      <div><dt>New investor fraction</dt><dd>{result.investorOwnership === null ? "Unknown" : `${result.investorOwnership.toFixed(1)}%`}</dd></div>
      <div><dt>Month 24 customers</dt><dd>{Math.round(result.rows[23].customers).toLocaleString()}</dd></div>
    </dl>{result.founderOwnership === null && <p className="small">Dilution is hidden because pre-money valuation is unknown (0).</p>}
    <p className="small">Simplified priced round. No SAFEs, preferences, option pools or future rounds. Customer counts use the same growth/churn factor as revenue.</p>
    <h3>Sources</h3>{decision.sources.map((s, i) => <p className="small" key={i}>{s.kind}: {s.label}</p>)}
    <p className="small">Engine {result.engine_version}, input {result.inputHash}<br />Calculated {result.timestamp}</p></details>
  </aside>;
}
