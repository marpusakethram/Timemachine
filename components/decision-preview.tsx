"use client";
import { useMemo, useState } from "react";
import { defaults } from "@/lib/simulation/models";
import { simulate } from "@/lib/simulation/engine";
import { money, runwayLabel } from "./scenario-comparison";

export function DecisionPreview() {
  const [capital, setCapital] = useState(200000);
  const result = useMemo(() => simulate({ ...defaults, financing: capital }), [capital]);
  const bootstrap = useMemo(() => simulate(defaults), []);
  const width = 490, height = 170;
  const y = (cash: number) => height - 14 - ((cash + 30000) / 600000) * (height - 24);
  const line = (rows: typeof result.rows) => `M 0 ${y(defaults.cash)} ` + rows.map((row, i) => `L ${(i + 1) * width / 24} ${y(row.cash)}`).join(" ");
  const funded = line(result.rows);
  const base = line(bootstrap.rows);
  return <section className="preview" aria-label="Interactive fictional SaaS preview">
    <div className="preview-head"><span>Fictional SaaS, USD</span><span className="preview-paths" aria-hidden="true"><b>Bootstrap</b><b>Hire</b><b className="on">Raise</b></span></div>
    <div className="preview-figures">
      <div className="figure-main"><span>Founder ownership</span><strong data-testid="preview-ownership">{result.founderOwnership?.toFixed(1)}<small>%</small></strong></div>
      <dl>
        <div><dt>Modeled runway</dt><dd>{runwayLabel(result.runway)}</dd></div>
        <div><dt>Cash at month 24</dt><dd>{money(result.endingCash, "USD")}</dd></div>
      </dl>
    </div>
    <div className="preview-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Raising ${money(capital, "USD")} gives ${money(result.endingCash, "USD")} ending cash; bootstrap ends at ${money(bootstrap.endingCash, "USD")}.`}>
        {[0, 200000, 400000].map(v => <line key={v} className={v === 0 ? "zero" : "grid"} x1="0" x2={width} y1={y(v)} y2={y(v)} />)}
        <path className="base" d={base} />
        <path className="funded" d={funded} />
        <circle className="end" cx={width} cy={y(result.endingCash)} r="4" />
      </svg>
      <div className="preview-axis"><span>Today</span><span>Month 12</span><span>Month 24</span></div>
      <p className="preview-legend"><span><i className="k-funded" />Raise</span><span><i className="k-base" />Bootstrap</span></p>
    </div>
    <div className="preview-lever">
      <label htmlFor="preview-capital"><span>Capital raised</span><strong>{money(capital, "USD")}</strong></label>
      <input id="preview-capital" aria-label="Demo capital slider" type="range" min="0" max="500000" step="10000" value={capital} onChange={e => setCapital(Number(e.target.value))} />
      <div><span>Keep more of the company</span><span>Buy more runway</span></div>
    </div>
  </section>;
}
