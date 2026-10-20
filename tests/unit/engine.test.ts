import { describe, expect, it } from "vitest";
import { defaults, Decision, SimulationResult, Values } from "@/lib/simulation/models";
import { inputHash, resolveValues, simulate } from "@/lib/simulation/engine";
import { sensitivity } from "@/lib/simulation/sensitivity";
import { sampleDecision } from "@/lib/sample";
import { csv, decodeShare, encodeShare, importScenario } from "@/lib/export/share";
import { parseCandidate } from "@/lib/ai/schema";
import golden from "@/fixtures/golden.json";
import sample from "@/fixtures/sample-saas.json";

const fixed = "2026-10-20T00:00:00.000Z";
describe("deterministic cash engine", () => {
  it("matches hand-calculated sample months", () => {
    const r = simulate(defaults, fixed);
    expect(r.rows[0].revenue).toBeCloseTo(golden.firstMonth.revenue, 8);
    expect(r.rows[0].cash).toBeCloseTo(golden.firstMonth.cash, 8);
    expect(r.rows[1].revenue).toBeCloseTo(golden.secondMonth.revenue, 8);
    expect(r.rows[1].cash).toBeCloseTo(golden.secondMonth.cash, 8);
  });
  it("zero revenue burns exactly monthly expenses", () => {
    const r = simulate({ ...defaults, revenue: 0 });
    expect(r.runway).toBe(8);
    expect(r.endingCash).toBe(-118000);
    expect(r.fundingNeeded).toBe(118000.01);
  });
  it("negative growth decreases revenue", () => {
    expect(simulate({ ...defaults, growth: -10, churn: 0 }).rows[0].revenue).toBe(3600);
  });
  it("zero burn preserves cash beyond the horizon", () => {
    const r = simulate({ ...defaults, revenue: 0, expenses: 0 });
    expect(r.runway).toBeNull();
    expect(r.endingCash).toBe(50000);
  });
  it("zero initial cash is a month-zero shortfall", () => {
    expect(simulate({ ...defaults, cash: 0, financing: 200000 }).runway).toBe(0);
  });
  it("financing arrives exactly in month one", () => {
    const r = simulate({ ...defaults, revenue: 0, financing: 10000, financingMonth: 1 });
    expect(r.rows[0].financing).toBe(10000);
    expect(r.rows[0].cash).toBe(53000);
    expect(r.rows[1].financing).toBe(0);
  });
  it("financing month 24 does not conceal an earlier failure", () => {
    const r = simulate({ ...defaults, revenue: 0, financing: 200000, financingMonth: 24 });
    expect(r.rows[22].financing).toBe(0);
    expect(r.rows[23].financing).toBe(200000);
    expect(r.runway).toBe(8);
    expect(r.minimumCash).toBe(-111000);
  });
  it("zero margin makes all revenue COGS", () => {
    const r = simulate({ ...defaults, margin: 0 });
    expect(r.rows[0].grossProfit).toBe(0);
    expect(r.endingCash).toBe(-118000);
  });
  it("100 percent margin has no COGS", () => {
    expect(simulate({ ...defaults, margin: 100 }).rows[0].cogs).toBe(0);
  });
  it("100 percent churn removes all revenue", () => {
    expect(simulate({ ...defaults, churn: 100 }).revenue24).toBe(0);
  });
  it("hiring step begins in its specified month", () => {
    const r = simulate({ ...defaults, hiring: 10000, hiringMonth: 3 });
    expect(r.rows[1].expenses).toBe(7000);
    expect(r.rows[2].expenses).toBe(17000);
    expect(r.rows[23].expenses).toBe(17000);
  });
  it("capex occurs once", () => {
    const r = simulate({ ...defaults, capex: 5000, capexMonth: 2 });
    expect(r.rows.reduce((sum, r) => sum + r.capex, 0)).toBe(5000);
    expect(r.rows[1].capex).toBe(5000);
  });
  it("priced round math matches one-sixth ownership", () => {
    const r = simulate({ ...defaults, financing: 200000, valuation: 1000000 });
    expect(r.investorOwnership).toBeCloseTo(16.6666667);
    expect(r.founderOwnership).toBeCloseTo(83.3333333);
  });
  it("existing founder ownership is multiplied, not subtracted", () => {
    expect(simulate({ ...defaults, ownership: 60, financing: 200000 }).founderOwnership).toBe(50);
  });
  it("unknown valuation suppresses dilution only when financing exists", () => {
    expect(simulate({ ...defaults, valuation: 0, financing: 200000 }).founderOwnership).toBeNull();
    expect(simulate({ ...defaults, valuation: 0 }).founderOwnership).toBe(100);
  });
  it("branch defaults inherit baseline and explicit zeros override", () => {
    expect(resolveValues(defaults, { overrides: { growth: 0 } })).toEqual({ ...defaults, growth: 0 });
  });
  it("reproduces identical snapshots with fixed timestamp", () => {
    expect(simulate(defaults, fixed)).toEqual(simulate({ ...defaults }, fixed));
    expect(inputHash(defaults)).not.toBe(inputHash({ ...defaults, growth: 6 }));
  });
  it("supported outliers remain finite", () => {
    const r = simulate({ ...defaults, cash: 100000000, revenue: 10000000, growth: 50, expenses: 10000000 });
    expect(Number.isFinite(r.endingCash)).toBe(true);
    expect(SimulationResult.safeParse(r).success).toBe(true);
  });
  it("rejects impossible ranges and nonfinite numbers", () => {
    for (const v of [{ cash: -1 }, { margin: 101 }, { churn: -1 }, { revenue: Infinity }, { growth: 51 }, { financingMonth: 1.5 }]) {
      expect(Values.safeParse({ ...defaults, ...v }).success).toBe(false);
    }
  });
  it("sensitivity is deterministic and all grids have fixed labeled inputs", () => {
    const s = sensitivity(defaults);
    expect(s).toEqual(sensitivity(defaults));
    expect(s.grid).toHaveLength(5);
    expect(s.grid[0].cells).toHaveLength(7);
    expect(s.growth[6].endingCash).toBeGreaterThan(s.growth[0].endingCash);
  });
});
describe("portable scenario boundary", () => {
  it("sample is a valid three-branch decision", () => {
    expect(Decision.parse(sampleDecision()).branches).toHaveLength(3);
    expect(Decision.parse(sample).baseline.values).toEqual(defaults);
  });
  it("JSON and Unicode share link roundtrip", () => {
    const d = sampleDecision(); d.title = "₹ café — build?";
    expect(importScenario(JSON.stringify(d))).toEqual(d);
    expect(decodeShare(encodeShare(d))).toEqual(d);
  });
  it("rejects corrupt, oversized and unsupported imports", () => {
    expect(() => importScenario("{")).toThrow();
    expect(() => importScenario(" ".repeat(100001))).toThrow();
    expect(() => importScenario(JSON.stringify({ ...sampleDecision(), schema_version: 99 }))).toThrow();
  });
  it("requires unique UUIDs and override provenance", () => {
    const d = sampleDecision(); d.branches[1].id = d.branches[0].id;
    expect(Decision.safeParse(d).success).toBe(false);
    d.branches[1].id = crypto.randomUUID(); d.branches[1].metadata = {};
    expect(Decision.safeParse(d).success).toBe(false);
  });
  it("CSV exports a header and exactly 24 monthly rows", () => {
    const text = csv(simulate(defaults));
    expect(text.split("\r\n")).toHaveLength(25);
    expect(text.split("\r\n")[0]).toContain("operatingCashFlow");
  });
  it("AI strips keys and clamps explained extreme values", () => {
    const branch = { name: "Lean", thesis: "Test demand", assumptions: [
      { field: "growth", value: 100, explanation: "This extreme input is speculative and requires evidence from a small controlled experiment." },
      { field: "expenses", value: 7000, explanation: "Recurring costs from the supplied baseline." },
      { field: "churn", value: 2, explanation: "Illustrative monthly customer loss assumption." },
    ], actions: ["Test"], risks: ["May fail"], signals: ["No demand"], experiments: ["Interview"] };
    const c = parseCandidate({ title: "Try", secret: "removed", branches: [branch, { ...branch, name: "Hire" }, { ...branch, name: "Raise" }], warnings: [] });
    expect(c).not.toHaveProperty("secret");
    expect(c.branches[0].assumptions[0].value).toBe(50);
  });
});
