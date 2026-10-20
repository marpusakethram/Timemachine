import { afterEach, expect, it, vi } from "vitest";
import { listScenarios, removeScenario, saveScenario } from "@/lib/storage/scenario-store";
import { sampleDecision } from "@/lib/sample";
afterEach(() => vi.unstubAllGlobals());
it("creates, edits, saves, reloads and deletes without a model call", () => {
  const data = new Map<string, string>();
  vi.stubGlobal("localStorage", { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v) });
  const d = sampleDecision(); saveScenario(d);
  d.title = "Edited decision"; saveScenario(d);
  expect(listScenarios()).toHaveLength(1);
  expect(listScenarios()[0].title).toBe("Edited decision");
  removeScenario(d.id); expect(listScenarios()).toEqual([]);
});
it("does not overwrite corrupt local storage", () => {
  const setter = vi.fn();
  vi.stubGlobal("localStorage", { getItem: () => "{invalid", setItem: setter });
  expect(() => saveScenario(sampleDecision())).toThrow();
  expect(setter).not.toHaveBeenCalled();
});
