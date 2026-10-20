import { Decision } from "../simulation/models";
const KEY = "timemachine.scenarios.v1";
export function listScenarios(): Decision[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  const list: unknown = JSON.parse(raw);
  if (!Array.isArray(list)) throw new Error("Saved data is corrupt. Import a backup or clear this site's storage.");
  return list.map(item => Decision.parse(item));
}
export function saveScenario(scenario: Decision) {
  const valid = Decision.parse(scenario);
  const all = listScenarios().filter(s => s.id !== valid.id);
  if (all.length >= 50) throw new Error("Local library is full (50 scenarios). Export and remove an older scenario first.");
  localStorage.setItem(KEY, JSON.stringify([valid, ...all]));
}
export function removeScenario(id: string) {
  localStorage.setItem(KEY, JSON.stringify(listScenarios().filter(s => s.id !== id)));
}
