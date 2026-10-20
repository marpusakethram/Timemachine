import { Decision, SimulationResult } from "../simulation/models";
export const MAX_IMPORT_BYTES = 100000;
export function importScenario(text: string): Decision {
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error("File too large. Maximum 100 KB.");
  return Decision.parse(JSON.parse(text));
}
export function encodeShare(decision: Decision) {
  const bytes = new TextEncoder().encode(JSON.stringify(Decision.parse(decision)));
  const encoded = btoa(Array.from(bytes, b => String.fromCharCode(b)).join(""));
  if (encoded.length > 14000) throw new Error("This scenario is too large for a link. Export JSON instead.");
  return "#scenario=" + encodeURIComponent(encoded);
}
export function decodeShare(hash: string) {
  if (hash.length > 20000) throw new Error("Share link is too large.");
  const raw = atob(decodeURIComponent(hash.replace(/^#scenario=/, "")));
  return importScenario(new TextDecoder().decode(Uint8Array.from(raw, c => c.charCodeAt(0))));
}
export function csv(result: SimulationResult) {
  const keys = Object.keys(result.rows[0]) as (keyof SimulationResult["rows"][number])[];
  return [keys.join(","), ...result.rows.map(row => keys.map(k => row[k]).join(","))].join("\r\n");
}
export function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
