import { Branch, ENGINE_VERSION, SimulationResult, Values } from "./models";

export function resolveValues(baseline: Values, branch: Pick<Branch, "overrides">): Values {
  return Values.parse({ ...baseline, ...branch.overrides });
}
// Stable non-security fingerprint; no secrets or cryptographic guarantees.
export function inputHash(value: unknown): string {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16).padStart(8, "0");
}
export function simulate(input: Values, timestamp = new Date().toISOString()): SimulationResult {
  const v = Values.parse(input);
  const rows: SimulationResult["rows"] = [];
  let cash = v.cash, revenue = v.revenue, customers = v.customers;
  let runway: number | null = cash <= 0 ? 0 : null;
  let minimumCash = cash;
  for (let month = 1; month <= 24; month++) {
    const beginningCash = cash;
    revenue *= (1 + v.growth / 100) * (1 - v.churn / 100);
    customers *= (1 + v.growth / 100) * (1 - v.churn / 100);
    const cogs = revenue * (1 - v.margin / 100);
    const grossProfit = revenue - cogs;
    const expenses = v.expenses + (month >= v.hiringMonth ? v.hiring : 0);
    const operatingCashFlow = grossProfit - expenses;
    const financing = month === v.financingMonth ? v.financing : 0;
    const capex = month === v.capexMonth ? v.capex : 0;
    cash += operatingCashFlow + financing - capex;
    minimumCash = Math.min(minimumCash, cash);
    if (cash <= 0 && runway === null) runway = month;
    rows.push({ month, beginningCash, revenue, cogs, grossProfit, expenses, operatingCashFlow, financing, capex, cash, customers });
  }
  const valued = v.financing === 0 || v.valuation > 0;
  return {
    rows, runway, minimumCash, fundingNeeded: minimumCash <= 0 ? Math.ceil(-minimumCash * 100 + 1) / 100 : 0,
    endingCash: cash, revenue12: rows[11].revenue, revenue24: rows[23].revenue, grossMargin: v.margin,
    investorOwnership: valued ? (v.financing === 0 ? 0 : v.financing / (v.valuation + v.financing) * 100) : null,
    founderOwnership: valued ? (v.financing === 0 ? v.ownership : v.ownership * v.valuation / (v.valuation + v.financing)) : null,
    inputHash: inputHash({ engine: ENGINE_VERSION, values: v }), timestamp, engine_version: ENGINE_VERSION,
  };
}
