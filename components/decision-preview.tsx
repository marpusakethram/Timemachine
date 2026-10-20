"use client";
import { useMemo, useState } from "react";
import { defaults } from "@/lib/simulation/models";
import { simulate } from "@/lib/simulation/engine";
import { money, runwayLabel } from "./scenario-comparison";

export function DecisionPreview() {
  const [capital, setCapital] = useState(200000);
  const result = useMemo(() => simulate({ ...defaults, financing: capital }), [capital]);
  const bootstrap = useMemo(() => simulate(defaults), []);
  const width = 360, height = 96;
  const y = (cash: number) => height - 8 - ((cash + 30000) / 600000) * (height - 16);
  const line = (rows: typeof result.rows) => `M 0 ${y(defaults.cash)} ` + rows.map((row, i) => `L ${(i + 1) * width / 24} ${y(row.cash)}`).join(" ");
  return <section className="live-widget" aria-label="Interactive fictional SaaS preview">
    <div className="live-widget-head"><span className="live-dot" />Live model, running on this page</div>
    <label className="live-widget-label" htmlFor="preview-capital">Capital raised <strong>{money(capital, "USD")}</strong></label>
    <input id="preview-capital" aria-label="Demo capital slider" type="range" min="0" max="500000" step="10000" value={capital} onChange={e => setCapital(Number(e.target.value))} />
    <dl className="live-widget-numbers">
      <div><dt>Runway</dt><dd>{runwayLabel(result.runway)}</dd></div>
      <div><dt>Cash at month 24</dt><dd>{money(result.endingCash, "USD", true)}</dd></div>
      <div><dt>Founders own</dt><dd data-testid="preview-ownership">{result.founderOwnership?.toFixed(1)}%</dd></div>
    </dl>
    <svg className="live-widget-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={`Raising ${money(capital, "USD")} gives ${money(result.endingCash, "USD")} ending cash; bootstrap ends at ${money(bootstrap.endingCash, "USD")}.`}>
      <line x1="0" x2={width} y1={y(0)} y2={y(0)} stroke="var(--line)" />
      <path d={line(bootstrap.rows)} fill="none" stroke="var(--sky)" strokeWidth="2" strokeOpacity=".45" vectorEffect="non-scaling-stroke" />
      <path d={line(result.rows)} fill="none" stroke="var(--mint)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
    <p className="live-widget-foot"><span><i className="key key-mint" />Raise</span><span><i className="key key-sky" />Stay lean</span><span>Made up SaaS numbers, not a forecast</span></p>
  </section>;
}
