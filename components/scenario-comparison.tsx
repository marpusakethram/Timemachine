"use client";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Branch, SimulationResult, Values } from "@/lib/simulation/models";
import { growthGrid, sensitivity } from "@/lib/simulation/sensitivity";
import { COLORS, PATH_LETTERS } from "./branch-graph";
export const money = (n: number, currency: string, compact = false) => new Intl.NumberFormat("en", { style: "currency", currency, notation: compact ? "compact" : "standard", maximumFractionDigits: 0 }).format(n);
export const runwayLabel = (n: number | null) => n === null ? "Beyond 24 mo" : `${n} months`;
const ownership = (r: SimulationResult) => r.founderOwnership === null ? "Unknown" : `${r.founderOwnership.toFixed(1)}%`;
const tooltipStyle = { background: "#ffffff", border: "1px solid #dbe0e6", borderRadius: 12, boxShadow: "0 8px 24px rgba(28,42,51,.12)", fontSize: 12 };
export function KpiStrip({ branch, result, currency, color }: { branch: Branch; result: SimulationResult; currency: string; color: string }) {
  const short = result.runway !== null && result.runway < 12;
  return <section className="kpi-strip" aria-label={`Key numbers for ${branch.name}`} style={{ "--branch-color": color } as React.CSSProperties}>
    <div className="kpi"><span><i className="path-dot" />Runway</span><strong className={short ? "negative" : ""}>{runwayLabel(result.runway)}</strong><small>{short ? "Less than a year of cash" : "Until cash hits zero"}</small></div>
    <div className="kpi"><span>Cash at month 24</span><strong className={result.endingCash < 0 ? "negative" : ""}>{money(result.endingCash, currency)}</strong><small>{result.endingCash < 0 ? "Money you would be short" : "Left in the bank"}</small></div>
    <div className="kpi"><span>Funding gap</span><strong>{money(result.fundingNeeded, currency)}</strong><small>Extra cash needed up front</small></div>
    <div className="kpi"><span>Founders own</span><strong>{ownership(result)}</strong><small>After any new money</small></div>
  </section>;
}
export function ScenarioComparison({ branches, results, currency, selected, onSelect }: { branches: Branch[]; results: SimulationResult[]; currency: string; selected: number; onSelect: (i: number) => void }) {
  const [sort, setSort] = useState("branch");
  const order = [0, 1, 2].sort((a, b) => sort === "cash" ? results[b].endingCash - results[a].endingCash : sort === "runway" ? (results[b].runway ?? 25) - (results[a].runway ?? 25) : a - b);
  return <section className="card" aria-label="Scenario comparison">
    <div className="card-head"><div><h2>Compare the paths</h2><p className="card-sub">Same baseline, different bets. Click a path to focus on it.</p></div><label className="sort-label">Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option value="branch">Path order</option><option value="cash">Ending cash</option><option value="runway">Runway</option></select></label></div>
    <div className="comparison-grid">{order.map(i => {
      const r = results[i];
      return <button key={branches[i].id} className={`comparison-card ${selected === i ? "selected" : ""}`} onClick={() => onSelect(i)} aria-pressed={selected === i} style={{ "--branch-color": COLORS[i] } as React.CSSProperties}>
        <span className="card-branch"><i />Path {PATH_LETTERS[i]}{selected === i && <em>Selected</em>}</span><h3>{branches[i].name}</h3><div className="runway-value">{runwayLabel(r.runway)}</div><span className="fine-print">of runway</span>
        <dl><div><dt>Cash at month 24</dt><dd className={r.endingCash < 0 ? "negative" : ""}>{money(r.endingCash, currency)}</dd></div><div><dt>Month 24 revenue</dt><dd>{money(r.revenue24, currency)}</dd></div><div><dt>Funding gap</dt><dd>{money(r.fundingNeeded, currency)}</dd></div><div><dt>Founders own</dt><dd>{ownership(r)}</dd></div></dl>
      </button>;
    })}</div>
  </section>;
}
export function CashChart({ branches, results, currency, selected, startingCash }: { branches: Branch[]; results: SimulationResult[]; currency: string; selected: number; startingCash: number[] }) {
  const data = [{ month: 0, b0: startingCash[0], b1: startingCash[1], b2: startingCash[2] }, ...results[0].rows.map((r, j) => ({ month: r.month, b0: results[0].rows[j].cash, b1: results[1].rows[j].cash, b2: results[2].rows[j].cash }))];
  return <section className="card chart-card"><div className="card-head"><div><h2>Cash in the bank</h2><p className="card-sub">Month by month for 24 months, in {currency}.</p></div></div>
    <div className="chart-legend">{branches.map((b, i) => <span key={b.id} className={i === selected ? "active" : ""}><i style={{ background: COLORS[i] }} />{b.name}</span>)}</div>
    <div className="chart" role="img" aria-label="Cash balance over 24 months for all three branches">
      <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="#e9edf1" /><XAxis dataKey="month" stroke="#586773" tickLine={false} axisLine={{ stroke: "#dbe0e6" }} tickFormatter={n => `M${n}`} interval="preserveStartEnd" minTickGap={18} /><YAxis stroke="#586773" tickLine={false} axisLine={false} width={72} tickFormatter={n => money(n, currency, true)} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => money(Number(v), currency)} labelFormatter={v => `Month ${v}`} /><ReferenceLine y={0} stroke="#d2423b" strokeDasharray="4 4" />
        {branches.map((b, i) => <Line key={b.id} name={b.name} dataKey={`b${i}`} type="monotone" stroke={COLORS[i]} strokeWidth={i === selected ? 2.75 : 1.5} opacity={i === selected ? 1 : 0.45} dot={false} isAnimationActive={false} />)}
      </LineChart></ResponsiveContainer>
    </div><p className="fine-print">Below zero means money you would need to find. The lines keep going so you can see how big the gap gets.</p>
  </section>;
}
export function Sensitivity({ values, currency }: { values: Values; currency: string }) {
  const s = sensitivity(values);
  return <details className="card sensitivity"><summary>Stress test <span>Runway in months as growth and spending change</span></summary>
    <p className="fine-print">Modeled assumptions, not certainty. Every other input on the selected path stays fixed.</p>
    <div className="chart short" role="img" aria-label="Ending cash as monthly growth varies from zero to twelve percent"><ResponsiveContainer width="100%" height="100%"><LineChart data={s.growth} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
      <CartesianGrid vertical={false} stroke="#e9edf1" /><XAxis dataKey="growth" stroke="#586773" tickLine={false} axisLine={{ stroke: "#dbe0e6" }} tickFormatter={v => `${v}%`} /><YAxis stroke="#586773" tickLine={false} axisLine={false} width={80} tickFormatter={v => money(v, currency, true)} /><Tooltip contentStyle={tooltipStyle} formatter={v => money(Number(v), currency)} labelFormatter={v => `${v}% gross monthly growth`} /><Line dataKey="endingCash" stroke="#2e6be6" strokeWidth={2} dot={false} name="Ending cash" isAnimationActive={false} />
    </LineChart></ResponsiveContainer></div>
    <div className="heat-legend"><span><i className="heat-ok" />Beyond 24 months</span><span><i className="heat-mid" />12 to 24 months</span><span><i className="heat-bad" />Under 12 months</span></div>
    <div className="table-scroll"><table className="heat-table"><caption>Rows are monthly spending in {currency}. Columns are monthly growth.</caption><thead><tr><th scope="col">Expense / mo</th>{growthGrid.map(g => <th key={g} scope="col">{g}%</th>)}</tr></thead><tbody>{s.grid.map(row => <tr key={row.expense}><th scope="row">{money(row.expense, currency)}</th>{row.cells.map(cell => <td key={cell.growth} className={cell.runway === null ? "heat-ok" : cell.runway < 12 ? "heat-bad" : "heat-mid"}>{cell.runway ?? ">24"}</td>)}</tr>)}</tbody></table></div>
  </details>;
}
