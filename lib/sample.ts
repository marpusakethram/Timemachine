import { baselineMetadata, Branch, Decision, defaults, ENGINE_VERSION, metadata, Values } from "./simulation/models";

export function templateBranches(): Branch[] {
  const make = (name: string, thesis: string, overrides: Partial<Values>, risk: string, signal: string, experiment: string): Branch => ({
    id: crypto.randomUUID(), name, thesis, overrides,
    metadata: Object.fromEntries(Object.keys(overrides).map(k => [k, metadata("sample", "Fictional template assumption; edit to fit your dilemma.")])),
    actions: [thesis], risks: [risk], signals: [signal], experiments: [experiment], horizon: 24, reviewed: true,
  });
  return [
    make("Bootstrap conservatively", "Keep the team lean and fund operations from customers.", {}, "Growth may not cover recurring costs.", "Cash falls while acquisition slows.", "Test one low-cost acquisition channel for four weeks."),
    make("Hire two engineers", "Add delivery capacity in month 3 with $10,000 in added monthly costs.", { hiring: 10000, hiringMonth: 3, growth: 8 }, "Hiring cost arrives before any uncertain growth benefit.", "New releases do not improve activation.", "Validate delivery bottlenecks before making offers."),
    make("Raise $200k", "Model a $200,000 priced round at a hypothetical $1m pre-money valuation.", { financing: 200000, valuation: 1000000, financingMonth: 1 }, "The round may not close; ownership is diluted.", "Investor discussions do not progress to signed terms.", "Compare a no-financing case before committing spending."),
  ];
}
export function sampleDecision(): Decision {
  const at = new Date().toISOString();
  return Decision.parse({
    id: crypto.randomUUID(), title: "Build patiently. Hire faster. Or raise?",
    description: "Our fictional SaaS has $50k in cash and $4k MRR. Should we keep bootstrapping, hire two engineers, or raise $200k?",
    baseline: { values: { ...defaults }, metadata: baselineMetadata("sample"), currency: "USD" },
    branches: templateBranches(), schema_version: 1, engine_version: ENGINE_VERSION, createdAt: at, updatedAt: at,
    sources: [{ label: "Fictional SaaS demo — illustrative assumptions, not empirical data", kind: "sample" }],
  });
}
