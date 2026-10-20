"use client";
import { useMemo, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { defaults } from "@/lib/simulation/models";
import { simulate } from "@/lib/simulation/engine";
import { money, runwayLabel } from "./scenario-comparison";

export function DecisionPreview() {
  const [capital, setCapital] = useState(200000);
  const result = useMemo(() => simulate({ ...defaults, financing: capital }), [capital]);
  const bootstrap = useMemo(() => simulate(defaults), []);
  const width = 490, height = 170;
  const y = (cash: number) => height - 16 - ((cash + 30000) / 600000) * (height - 28);
  const line = (rows: typeof result.rows) => `M 0 ${y(defaults.cash)} ` + rows.map((row, i) => `L ${(i + 1) * width / 24} ${y(row.cash)}`).join(" ");
  const funded = line(result.rows);
  const base = line(bootstrap.rows);
  return <section className="preview card" aria-label="Interactive fictional SaaS preview">
    <div className="preview-chrome"><span className="chrome-dots"><i /><i /><i /></span><span>Fictional SaaS / USD</span><span className="badge badge-live"><span className="dot" />Live model</span></div>
    <div className="preview-body">
      <div className="preview-head"><div><span className="kicker">Path 03</span><h2>Raise capital</h2></div><div className="preview-tabs" aria-hidden="true"><span>Bootstrap</span><span>Hire</span><span className="active">Raise</span></div></div>
      <div className="preview-metrics">
        <div><span>Modeled runway</span><strong>{runwayLabel(result.runway)}</strong></div>
        <div><span>Ending cash</span><strong>{money(result.endingCash, "USD", true)}</strong></div>
        <div><span>Founder ownership</span><strong data-testid="preview-ownership">{result.founderOwnership?.toFixed(1)}%</strong></div>
      </div>
      <div className="preview-chart">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Raising ${money(capital, "USD")} gives ${money(result.endingCash, "USD")} ending cash; bootstrap ends at ${money(bootstrap.endingCash, "USD")}.`}>
          <defs><linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--brand)" stopOpacity=".16" /><stop offset="100%" stopColor="var(--brand)" stopOpacity="0" /></linearGradient></defs>
          {[0, 200000, 400000].map(v => <line key={v} x1="0" x2={width} y1={y(v)} y2={y(v)} stroke="var(--line)" />)}
          <path d={`${funded} L ${width} ${height} L 0 ${height} Z`} fill="url(#preview-fill)" />
          <path d={base} fill="none" stroke="var(--faint)" strokeWidth="1.5" strokeDasharray="5 5" />
          <path d={funded} fill="none" stroke="var(--brand)" strokeWidth="2.5" />
          <circle cx={width - 3} cy={y(result.endingCash)} r="4" fill="var(--brand)" />
        </svg>
        <div className="preview-axis"><span>Today</span><span>Month 12</span><span>Month 24</span></div>
      </div>
      <div className="preview-lever"><label htmlFor="preview-capital"><span><MoveHorizontal size={15} />Try moving the capital raised</span><strong>{money(capital, "USD")}</strong></label>
        <input id="preview-capital" aria-label="Demo capital slider" type="range" min="0" max="500000" step="10000" value={capital} onChange={e => setCapital(Number(e.target.value))} />
        <div><span>Less dilution</span><span>More cash to work with</span></div>
      </div>
      <div className="preview-legend"><span><i className="swatch" />Raise path</span><span><i className="swatch swatch-dashed" />Bootstrap for reference</span><span className="spacer">Hypothetical, not a forecast</span></div>
    </div>
  </section>;
}
