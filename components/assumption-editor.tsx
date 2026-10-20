"use client";
import { useEffect, useState } from "react";
import { fields, Field, Metadata, Values } from "@/lib/simulation/models";

export function NumericField({ name, value, meta, onChange }: { name: Field; value: number; meta: Metadata; onChange: (value: number) => void }) {
  const f = fields[name];
  const [text, setText] = useState(String(value));
  const [error, setError] = useState("");
  useEffect(() => { setText(String(value)); setError(""); }, [value]);
  const update = (raw: string) => {
    setText(raw);
    const n = Number(raw);
    if (!raw.trim() || !Number.isFinite(n) || n < f.min || n > f.max || ((f.unit === "month" || name === "customers") && !Number.isInteger(n))) {
      setError(`Enter ${f.min.toLocaleString()}–${f.max.toLocaleString()}${f.unit === "month" || name === "customers" ? " (whole numbers)" : ""}.`);
      return;
    }
    setError(""); onChange(n);
  };
  const sliderMax = name === "financing" ? Math.max(500000, value) : name === "expenses" ? Math.max(25000, value) : f.max;
  return <div className="numeric-field">
    <div className="field-label"><label htmlFor={`number-${name}`}>{f.label}</label><span title={`${meta.explanation}\nEdited ${meta.lastEdited}`} className={`provenance ${meta.provenance}`}>{meta.provenance}</span></div>
    <div className="number-wrap"><input id={`number-${name}`} type="number" min={f.min} max={f.max} step={f.unit === "month" || name === "customers" ? 1 : "any"} value={text} onChange={e => update(e.target.value)} aria-invalid={!!error} aria-describedby={`tip-${name}`} /><span>{f.unit}</span></div>
    {["growth", "financing", "expenses", "margin", "churn"].includes(name) && <input aria-label={`${f.label} slider`} type="range" min={f.min} max={sliderMax} step={f.step} value={value} onChange={e => update(e.target.value)} />}
    <small id={`tip-${name}`} className={error ? "error" : "field-tip"}>{error || f.tip}</small>
  </div>;
}
export function AssumptionEditor({ values, metadata, onChange, expanded = false }: { values: Values; metadata: Record<Field, Metadata>; onChange: (name: Field, value: number) => void; expanded?: boolean }) {
  const primary: Field[] = ["growth", "expenses", "financing", "valuation"];
  const rest = (Object.keys(fields) as Field[]).filter(k => !primary.includes(k));
  const field = (k: Field) => <NumericField key={k} name={k} value={values[k]} meta={metadata[k]} onChange={v => onChange(k, v)} />;
  return <>{primary.map(field)}<details open={expanded || undefined}><summary>All assumptions <span>{rest.length}</span></summary>{rest.map(field)}</details></>;
}
