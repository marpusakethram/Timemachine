"use client";
import { useMemo, useState } from "react";
import { ArrowUpRight, GitBranch, MoveHorizontal } from "lucide-react";
import { defaults } from "@/lib/simulation/models";
import { simulate } from "@/lib/simulation/engine";
import { money, runwayLabel } from "./scenario-comparison";

export function DecisionPreview() {
  const [capital, setCapital] = useState(200000);
  const result = useMemo(() => simulate({ ...defaults, financing: capital }), [capital]);
  const bootstrap = useMemo(() => simulate(defaults), []);
  const width = 490, height = 190;
  const y = (cash: number) => height - 20 - ((cash + 30000) / 600000) * (height - 32);
  const line = (rows: typeof result.rows) => `M 0 ${y(defaults.cash)} ` + rows.map((row, i) => `L ${(i + 1) * width / 24} ${y(row.cash)}`).join(" ");
  const funded = line(result.rows);
  const base = line(bootstrap.rows);
  return <section className="live-preview" aria-label="Interactive fictional SaaS preview">
    <div className="preview-topline"><span><i className="status-dot" />LIVE MODEL</span><span>FICTIONAL SAAS / USD</span></div>
    <div className="preview-decision"><span className="preview-symbol"><GitBranch size={22} /></span><div><span className="eyebrow">ONE DECISION. DIFFERENT FUTURES.</span><h2>More runway. A different stake.</h2></div><ArrowUpRight size={20} /></div>
    <div className="preview-paths"><span>01 <b>Bootstrap</b></span><span>02 <b>Hire</b></span><span className="active">03 <b>Raise capital</b><i /></span></div>
    <div className="preview-metrics">
      <div><span>Modeled runway</span><strong>{runwayLabel(result.runway)}</strong></div>
      <div><span>Founder ownership</span><strong data-testid="preview-ownership">{result.founderOwnership?.toFixed(1)}<small>%</small></strong></div>
    </div>
    <div className="preview-chart">
      <span className="preview-axis-title">CASH BALANCE</span>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Raising ${money(capital, "USD")} gives ${money(result.endingCash, "USD")} ending cash; bootstrap ends at ${money(bootstrap.endingCash, "USD")}.`}>
        <defs><linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#91b9f2" stopOpacity=".18" /><stop offset="100%" stopColor="#91b9f2" stopOpacity="0" /></linearGradient></defs>
        {[0, 200000, 400000].map(v => <line key={v} x1="0" x2={width} y1={y(v)} y2={y(v)} stroke="#30415a" strokeDasharray="3 7" />)}
        <path d={`${funded} L ${width} ${height} L 0 ${height} Z`} fill="url(#preview-fill)" />
        <path d={base} fill="none" stroke="#647c9e" strokeWidth="1.5" strokeDasharray="5 5" />
        <path d={funded} fill="none" stroke="#adcaff" strokeWidth="2.5" />
        <circle cx={width} cy={y(result.endingCash)} r="4" fill="#adcaff" />
      </svg>
      <div className="preview-axis"><span>Today</span><span>Month 12</span><span>Month 24</span></div>
    </div>
    <div className="preview-lever"><label htmlFor="preview-capital"><span><MoveHorizontal size={15} />Try moving the capital</span><strong>{money(capital, "USD")}</strong></label>
      <input id="preview-capital" aria-label="Demo capital slider" type="range" min="0" max="500000" step="10000" value={capital} onChange={e => setCapital(Number(e.target.value))} />
      <div><span>Less dilution</span><span>More cash to work with</span></div>
    </div>
    <div className="preview-bottom"><span><i />Raise scenario <i className="muted-dot" />Bootstrap reference</span><span>Hypothetical · not a forecast</span></div>
  </section>;
}
