import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
const { call } = vi.hoisted(() => ({ call: vi.fn() }));
vi.mock("@google/genai", () => ({ GoogleGenAI: class { models = { generateContent: call }; } }));
import { generate } from "@/lib/ai/gemini";
import { defaults } from "@/lib/simulation/models";
let dir: string;
const candidate = {
  title: "Recorded test fixture, not a provider result",
  warnings: ["Synthetic fixture for connector testing."],
  branches: ["Lean", "Hire", "Raise"].map(name => ({
    name, thesis: "Test-only strategic option.",
    assumptions: [
      { field: "growth", value: 5, explanation: "Illustrative test assumption for growth." },
      { field: "churn", value: 2, explanation: "Illustrative test assumption for churn." },
      { field: "expenses", value: 7000, explanation: "Illustrative test assumption for expenses." },
    ],
    actions: ["Validate"], risks: ["Unknown"], signals: ["No demand"], experiments: ["Interview"],
  })),
};
const input = { title: "Test", description: "A fictional dilemma", values: defaults };
beforeEach(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), "timemachine-generation-"));
  call.mockReset();
  for (const [k, v] of Object.entries({
    GEMINI_API_KEY: "fake-unit-test-key", GEMINI_MODEL: "test-model", FREE_MODEL_ALLOWLIST: "test-model",
    FREE_MODEL_VERIFIED_ON: new Date().toISOString().slice(0, 10),
    GEMINI_UNBILLED_PROJECT_CONFIRMED: "true", TIMEMACHINE_DATA_DIR: dir,
    GEMINI_DAILY_REQUEST_LIMIT: "10", GEMINI_PER_RUN_LIMIT: "3",
  })) vi.stubEnv(k, v);
});
afterEach(async () => { vi.unstubAllEnvs(); await rm(dir, { recursive: true, force: true }); });
it("uses SDK structured output, caps and a durable deterministic cache", async () => {
  call.mockResolvedValue({ text: JSON.stringify(candidate) });
  const first = await generate(input);
  const second = await generate(input);
  expect(first.candidate.branches).toHaveLength(3);
  expect(first.cached).toBe(false); expect(second.cached).toBe(true);
  expect(call).toHaveBeenCalledTimes(1);
  expect(call.mock.calls[0][0].config.responseJsonSchema).toBeDefined();
  expect(call.mock.calls[0][0].config.maxOutputTokens).toBe(3000);
  expect(call.mock.calls[0][0].config.httpOptions.retryOptions.attempts).toBe(1);
});
it("permits only one corrective retry for malformed output", async () => {
  call.mockResolvedValue({ text: "{}" });
  await expect(generate(input)).rejects.toThrow("invalid candidate");
  expect(call).toHaveBeenCalledTimes(2);
});
it("validates the corrected result", async () => {
  call.mockResolvedValueOnce({ text: "not json" }).mockResolvedValueOnce({ text: JSON.stringify(candidate) });
  expect((await generate(input)).candidate.branches).toHaveLength(3);
  expect(call).toHaveBeenCalledTimes(2);
});
it("bounds transient retries inside the per-run request cap", async () => {
  vi.stubEnv("GEMINI_PER_RUN_LIMIT", "2");
  call.mockRejectedValue({ status: 429 });
  await expect(generate(input)).rejects.toThrow("quota reached");
  expect(call).toHaveBeenCalledTimes(2);
});
