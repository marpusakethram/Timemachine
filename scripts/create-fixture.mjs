import fs from "node:fs";
const at = "2026-10-20T00:00:00.000Z";
const values = { cash: 50000, revenue: 4000, expenses: 7000, margin: 80, customers: 40, growth: 5, churn: 2, financing: 0, financingMonth: 1, valuation: 1000000, ownership: 100, capex: 0, capexMonth: 1, hiring: 0, hiringMonth: 3 };
const meta = () => ({ provenance: "sample", lastEdited: at, explanation: "Fictional demo assumption. Not empirical data or a forecast." });
const branches = [
  { name: "Bootstrap conservatively", thesis: "Keep the team lean and fund operations from customers.", overrides: {}, risks: ["Growth may not cover recurring costs."], signals: ["Cash falls while acquisition slows."], experiments: ["Test one low-cost acquisition channel."] },
  { name: "Hire two engineers", thesis: "Add delivery capacity in month 3 with $10,000 in added monthly costs.", overrides: { hiring: 10000, hiringMonth: 3, growth: 8 }, risks: ["Hiring costs arrive before uncertain growth."], signals: ["Releases do not improve activation."], experiments: ["Validate delivery bottlenecks before hiring."] },
  { name: "Raise $200k", thesis: "Model a $200,000 round at a hypothetical $1m pre-money valuation.", overrides: { financing: 200000, financingMonth: 1, valuation: 1000000 }, risks: ["The round may not close."], signals: ["Investor discussions do not progress."], experiments: ["Compare a no-financing case."] },
].map((b, i) => ({ ...b, id: `10000000-0000-4000-8000-00000000000${i + 1}`, actions: [b.thesis], metadata: Object.fromEntries(Object.keys(b.overrides).map(k => [k, meta()])), horizon: 24, reviewed: true }));
const sample = {
  id: "10000000-0000-4000-8000-000000000000",
  title: "Build patiently. Hire faster. Or raise?",
  description: "Our fictional SaaS has $50k in cash and $4k MRR. Should we keep bootstrapping, hire two engineers, or raise $200k?",
  baseline: { values, currency: "USD", metadata: Object.fromEntries(Object.keys(values).map(k => [k, meta()])) },
  branches, schema_version: 1, engine_version: "1.0.0", createdAt: at, updatedAt: at,
  sources: [{ label: "Fictional SaaS sample — illustrative, not empirical", kind: "sample" }],
};
fs.mkdirSync("fixtures", { recursive: true });
fs.writeFileSync("fixtures/sample-saas.json", JSON.stringify(sample, null, 2) + "\n");
fs.writeFileSync("fixtures/golden.json", JSON.stringify({
  note: "Hand-calculated: revenue grows by 1.05 × 0.98 = 1.029; gross profit is 80%; OpEx is 7000.",
  firstMonth: { revenue: 4116, grossProfit: 3292.8, cash: 46292.8 },
  secondMonth: { revenue: 4235.364, grossProfit: 3388.2912, cash: 42681.0912 },
  zeroRevenue: { endingCash: -118000, runway: 8 },
  pricedRound: { amount: 200000, preMoney: 1000000, investorFraction: 1 / 6, founderFraction: 5 / 6 },
}, null, 2) + "\n");
