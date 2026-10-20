import { z } from "zod";

export const ENGINE_VERSION = "1.0.0";
export const SCHEMA_VERSION = 1;
export const UncertaintyLabel = z.enum(["entered", "sample", "inferred"]);
export const Citation = z.object({
  label: z.string().max(200), url: z.url().optional(),
  kind: z.enum(["user", "sample", "model", "reference"]),
});
export const ModelVersion = z.object({
  engine_version: z.literal(ENGINE_VERSION),
  schema_version: z.literal(SCHEMA_VERSION),
});

export const fields = {
  cash: { label: "Starting cash", unit: "currency", min: 0, max: 100000000, step: 1000, default: 50000, tip: "Cash available at month zero; excludes future financing." },
  revenue: { label: "Monthly revenue", unit: "currency / mo", min: 0, max: 10000000, step: 100, default: 4000, tip: "Recognized and collected in the same month in this simplified model." },
  expenses: { label: "Operating expenses", unit: "currency / mo", min: 0, max: 10000000, step: 250, default: 7000, tip: "Recurring expenses excluding cost of goods sold. No automatic cost savings." },
  margin: { label: "Gross margin", unit: "%", min: 0, max: 100, step: 1, default: 80, tip: "Revenue remaining after cost of goods sold; operating expenses are separate." },
  customers: { label: "Current customers", unit: "customers", min: 0, max: 10000000, step: 1, default: 40, tip: "Illustrative count using the same growth and churn as revenue." },
  growth: { label: "Monthly growth", unit: "% / mo", min: -50, max: 50, step: 0.5, default: 5, tip: "Gross revenue growth applied first; churn is then applied multiplicatively." },
  churn: { label: "Monthly churn", unit: "% / mo", min: 0, max: 100, step: 0.5, default: 2, tip: "Revenue loss after gross growth. Net factor = (1 + growth/100) × (1 − churn/100)." },
  financing: { label: "Capital raised", unit: "currency", min: 0, max: 100000000, step: 10000, default: 0, tip: "One hypothetical priced round. Cash arrives at the beginning of financing month." },
  financingMonth: { label: "Financing month", unit: "month", min: 1, max: 24, step: 1, default: 1, tip: "Month 1 is the first modeled month. Later funding cannot undo an earlier cash shortfall." },
  valuation: { label: "Pre-money valuation", unit: "currency", min: 0, max: 1000000000, step: 100000, default: 1000000, tip: "Hypothetical pre-money valuation. Enter 0 for unknown; ownership is then suppressed." },
  ownership: { label: "Founder ownership", unit: "%", min: 0, max: 100, step: 1, default: 100, tip: "Founders' collective ownership before this simplified priced round." },
  capex: { label: "One-time capex", unit: "currency", min: 0, max: 100000000, step: 1000, default: 0, tip: "One-time cash expenditure, paid in the specified capex month." },
  capexMonth: { label: "Capex month", unit: "month", min: 1, max: 24, step: 1, default: 1, tip: "Month in which one-time capex is paid." },
  hiring: { label: "Added hiring cost", unit: "currency / mo", min: 0, max: 10000000, step: 500, default: 0, tip: "Permanent increase in monthly operating expenses from the hiring month onward." },
  hiringMonth: { label: "Hiring starts", unit: "month", min: 1, max: 24, step: 1, default: 3, tip: "First month with added recurring hiring costs." },
} as const;
export type Field = keyof typeof fields;
const numberSchema = (key: Field) => {
  const f = fields[key];
  const n = z.number().finite().min(f.min).max(f.max);
  return f.unit === "month" || key === "customers" ? n.int() : n;
};
export const Values = z.object({
  cash: numberSchema("cash"), revenue: numberSchema("revenue"), expenses: numberSchema("expenses"),
  margin: numberSchema("margin"), customers: numberSchema("customers"), growth: numberSchema("growth"),
  churn: numberSchema("churn"), financing: numberSchema("financing"), financingMonth: numberSchema("financingMonth"),
  valuation: numberSchema("valuation"), ownership: numberSchema("ownership"), capex: numberSchema("capex"),
  capexMonth: numberSchema("capexMonth"), hiring: numberSchema("hiring"), hiringMonth: numberSchema("hiringMonth"),
});
export type Values = z.infer<typeof Values>;
export const defaults = Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v.default])) as Values;
export const Assumption = z.object({
  value: z.number().finite(), unit: z.string().max(40), provenance: UncertaintyLabel,
  lastEdited: z.iso.datetime(), explanation: z.string().max(500),
});
export const Metadata = z.object({
  provenance: UncertaintyLabel, lastEdited: z.iso.datetime(), explanation: z.string().max(500),
});
export type Metadata = z.infer<typeof Metadata>;
const fieldEnum = z.enum(Object.keys(fields) as [Field, ...Field[]]);
export const Baseline = z.object({
  values: Values, metadata: z.record(fieldEnum, Metadata),
  currency: z.enum(["USD", "EUR", "GBP", "INR"]),
});
export const Event = z.object({
  kind: z.enum(["financing", "capex", "hiring"]), month: z.number().int().min(1).max(24),
  amount: z.number().min(0).max(100000000),
});
export const Branch = z.object({
  id: z.uuid(), name: z.string().min(1).max(80), thesis: z.string().min(1).max(700),
  actions: z.array(z.string().max(300)).min(1).max(5),
  overrides: Values.partial(),
  metadata: z.partialRecord(fieldEnum, Metadata),
  risks: z.array(z.string().max(300)).min(1).max(5),
  signals: z.array(z.string().max(300)).min(1).max(5),
  experiments: z.array(z.string().max(300)).min(1).max(5),
  horizon: z.number().int().min(24).max(24).default(24),
  reviewed: z.boolean(),
});
export type Branch = z.infer<typeof Branch>;
export const Decision = z.object({
  id: z.uuid(), title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1500),
  baseline: Baseline, branches: z.array(Branch).length(3),
  schema_version: z.literal(SCHEMA_VERSION), engine_version: z.literal(ENGINE_VERSION),
  createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
  sources: z.array(Citation).max(10),
  generation: z.object({ model: z.string().max(100), at: z.iso.datetime(), cached: z.boolean() }).optional(),
}).superRefine((value, ctx) => {
  if (new Set(value.branches.map(b => b.id)).size !== 3) ctx.addIssue({ code: "custom", message: "Branch IDs must be unique", path: ["branches"] });
  value.branches.forEach((b, i) => {
    Object.keys(b.overrides).forEach(k => {
      if (!b.metadata[k as Field]) ctx.addIssue({ code: "custom", message: "Override needs provenance", path: ["branches", i, "metadata", k] });
    });
  });
});
export type Decision = z.infer<typeof Decision>;
export const MonthlySnapshot = z.object({
  month: z.number().int(), beginningCash: z.number(), revenue: z.number(), cogs: z.number(),
  grossProfit: z.number(), expenses: z.number(), operatingCashFlow: z.number(), financing: z.number(),
  capex: z.number(), cash: z.number(), customers: z.number(),
});
export const SimulationResult = z.object({
  rows: z.array(MonthlySnapshot), runway: z.number().nullable(), minimumCash: z.number(),
  fundingNeeded: z.number(), endingCash: z.number(), revenue12: z.number(), revenue24: z.number(),
  grossMargin: z.number(), investorOwnership: z.number().nullable(), founderOwnership: z.number().nullable(),
  inputHash: z.string(), timestamp: z.iso.datetime(), engine_version: z.literal(ENGINE_VERSION),
});
export type SimulationResult = z.infer<typeof SimulationResult>;

export function metadata(provenance: Metadata["provenance"], explanation: string): Metadata {
  return { provenance, explanation, lastEdited: new Date().toISOString() };
}
export function baselineMetadata(provenance: Metadata["provenance"]) {
  return Object.fromEntries(Object.keys(fields).map(k => [k, metadata(provenance, fields[k as Field].tip)])) as Record<Field, Metadata>;
}
