import { z } from "zod";
import { fields, Field } from "../simulation/models";
export const CandidateAssumption = z.object({
  field: z.enum(Object.keys(fields) as [Field, ...Field[]]),
  value: z.number().finite(),
  explanation: z.string().min(12).max(500),
});
export const Candidate = z.object({
  title: z.string().min(1).max(120),
  branches: z.array(z.object({
    name: z.string().min(1).max(80),
    thesis: z.string().min(1).max(700),
    assumptions: z.array(CandidateAssumption).min(3).max(5),
    actions: z.array(z.string().min(1).max(300)).min(1).max(5),
    risks: z.array(z.string().min(1).max(300)).min(1).max(5),
    signals: z.array(z.string().min(1).max(300)).min(1).max(5),
    experiments: z.array(z.string().min(1).max(300)).min(1).max(5),
  })).length(3),
  warnings: z.array(z.string().max(300)).max(5),
}).superRefine((c, ctx) => {
  if (new Set(c.branches.map(b => b.name.toLowerCase())).size !== 3) ctx.addIssue({ code: "custom", message: "Three distinct branch names required" });
  c.branches.forEach((b, i) => {
    if (new Set(b.assumptions.map(a => a.field)).size !== b.assumptions.length) ctx.addIssue({ code: "custom", message: "Duplicate assumption", path: ["branches", i] });
    b.assumptions.forEach(a => {
      const f = fields[a.field];
      if ((a.value < f.min || a.value > f.max || (a.field === "growth" && Math.abs(a.value) > 12)) && a.explanation.length < 40) {
        ctx.addIssue({ code: "custom", message: "Extreme assumptions need a meaningful explanation", path: ["branches", i] });
      }
    });
  });
});
export type Candidate = z.infer<typeof Candidate>;
export function parseCandidate(raw: unknown): Candidate {
  const parsed = Candidate.parse(raw);
  return {
    ...parsed,
    branches: parsed.branches.map(b => ({
      ...b, assumptions: b.assumptions.map(a => {
        const f = fields[a.field];
        let value = Math.min(f.max, Math.max(f.min, a.value));
        if (f.unit === "month" || a.field === "customers") value = Math.round(value);
        return { ...a, value, explanation: value !== a.value ? a.explanation.slice(0, 460) + " [Clamped to supported range.]" : a.explanation };
      }),
    })),
  };
}
