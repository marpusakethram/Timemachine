"use client";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Branch, SimulationResult, Values } from "@/lib/simulation/models";
import { growthGrid, sensitivity } from "@/lib/simulation/sensitivity";
import { COLORS } from "./branch-graph";
export const money = (n: number, currency: string, compact = false) => new Intl.NumberFormat("en", { style: "currency", currency, notation: compact ? "compact" : "standard", maximumFractionDigits: 0 }).format(n);
const TOOLTIP = { background: "var(--surface)", border: "1px solid var(--rule-strong)", borderRadius: 8, color: "var(--ink)" };
export const runwayLabel = (n: number | null) => n === null ? "Beyond 24 mo" : `${n} months`;
export function ScenarioComparison({ branches, results, currency, selected, onSelect }: { branches: Branch[]; results: SimulationResult[]; currency: string; selected: number; onSelect: (i: number) => void }) {
  const [sort, setSort] = useState("branch");
  const order = [0, 1, 2].sort((a, b) => sort === "cash" ? results[b].endingCash - results[a].endingCash : sort === "runway" ? (results[b].runway ?? 25) - (results[a].runway ?? 25) : a - b);
  return <section aria-label="Scenario comparison">
    <div className="section-heading"><h2>Compare paths</h2><label className="sort-label">Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option value="branch">Branch order</option><option value="cash">Ending cash</option><option value="runway">Runway</option></select></label></div>
    <div className="comparison-grid">{order.map(i => {
      const r = results[i];
      return <button key={branches[i].id} className={`comparison-card ${selected === i ? "selected" : ""}`} onClick={() => onSelect(i)} aria-pressed={selected === i} style={{ "--branch-color": COLORS[i] } as React.CSSProperties}>
        <span className="card-branch"><i />Path {i + 1}</span><h3>{branches[i].name}</h3><div className="runway-value">{runwayLabel(r.runway)}</div><span className="muted">until cash reaches zero</span>
        <dl><div><dt>Ending cash</dt><dd>{money(r.endingCash, currency)}</dd></div><div><dt>Month 24 revenue</dt><dd>{money(r.revenue24, currency)}</dd></div><div><dt>Funding gap</dt><dd>{money(r.fundingNeeded, currency)}</dd></div><div><dt>Founder ownership</dt><dd>{r.founderOwnership === null ? "Unknown" : `${r.founderOwnership.toFixed(1)}%`}</dd></div></dl>
      </button>;
    })}</div>
  </section>;
}
export function CashChart({ branches, results, currency, selected, startingCash }: { branches: Branch[]; results: SimulationResult[]; currency: string; selected: number; startingCash: number[] }) {
  const data = [{ month: 0, b0: startingCash[0], b1: startingCash[1], b2: startingCash[2] }, ...results[0].rows.map((r, j) => ({ month: r.month, b0: results[0].rows[j].cash, b1: results[1].rows[j].cash, b2: results[2].rows[j].cash }))];
  return <div className="chart-box"><div className="section-heading"><h2>Cash over 24 months</h2><span className="pill">{currency}</span></div>
    <div className="live-metrics" key={results[selected].inputHash}>
      <div><span>Modeled runway</span><strong>{runwayLabel(results[selected].runway)}</strong></div>
      <div><span>Ending cash</span><strong>{money(results[selected].endingCash, currency)}</strong></div>
      <div><span>Founder ownership</span><strong>{results[selected].founderOwnership === null ? "Unknown" : `${results[selected].founderOwnership.toFixed(1)}%`}</strong></div>
    </div>
    <div className="chart" role="img" aria-label="Cash balance over 24 months for all three branches">
      <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 10 }}>
        <CartesianGrid vertical={false} stroke="var(--rule)" strokeDasharray="3 6" /><XAxis dataKey="month" stroke="var(--ink-3)" tickLine={false} axisLine={false} tickFormatter={n => `M${n}`} /><YAxis stroke="var(--ink-3)" tickLine={false} axisLine={false} width={72} tickFormatter={n => money(n, currency, true)} />
        <Tooltip contentStyle={TOOLTIP} formatter={(v) => money(Number(v), currency)} labelFormatter={v => `Month ${v}`} /><ReferenceLine y={0} stroke="var(--danger)" strokeDasharray="4 4" />
        {branches.map((b, i) => <Line key={b.id} name={b.name} dataKey={`b${i}`} type="monotone" stroke={COLORS[i]} strokeWidth={i === selected ? 3 : 1.5} opacity={i === selected ? 1 : 0.55} dot={false} isAnimationActive={false} />)}
      </LineChart></ResponsiveContainer>
    </div><div className="chart-legend">{branches.map((b, i) => <span key={b.id}><i style={{ background: COLORS[i] }} />{b.name}</span>)}</div><p className="small muted">Negative cash is an unfunded gap, not permission to continue operating. Curves continue to illustrate the shortfall.</p>
  </div>;
}
export function Sensitivity({ values, currency }: { values: Values; currency: string }) {
  const s = sensitivity(values);
  return <details className="sensitivity"><summary>Sensitivity lab <span>Explore growth × spending</span></summary>
    <p className="small muted">Modeled assumptions, not certainty. All other selected-branch inputs stay fixed.</p>
    <div className="chart short" role="img" aria-label="Ending cash as monthly growth varies from zero to twelve percent"><ResponsiveContainer width="100%" height="100%"><LineChart data={s.growth}>
      <CartesianGrid stroke="var(--rule)" /><XAxis dataKey="growth" stroke="var(--ink-3)" tickFormatter={v => `${v}%`} /><YAxis stroke="var(--ink-3)" width={80} tickFormatter={v => money(v, currency, true)} /><Tooltip contentStyle={TOOLTIP} formatter={v => money(Number(v), currency)} labelFormatter={v => `${v}% gross monthly growth`} /><Line dataKey="endingCash" stroke="var(--accent)" name="Ending cash" isAnimationActive={false} />
    </LineChart></ResponsiveContainer></div>
    <div className="table-scroll"><table><caption>Runway in months: monthly operating expense ({currency}) × gross monthly growth</caption><thead><tr><th scope="col">Expense / mo</th>{growthGrid.map(g => <th key={g} scope="col">{g}%</th>)}</tr></thead><tbody>{s.grid.map(row => <tr key={row.expense}><th scope="row">{money(row.expense, currency)}</th>{row.cells.map(cell => <td key={cell.growth} className={cell.runway === null ? "cell-safe" : cell.runway < 12 ? "cell-risk" : "cell-mid"}>{cell.runway ?? ">24"}</td>)}</tr>)}</tbody></table></div>
  </details>;
}
