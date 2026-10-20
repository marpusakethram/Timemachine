import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { config, reserveRequest } from "@/lib/ai/gemini";
import { POST } from "@/app/api/scenarios/generate/route";
import { defaults } from "@/lib/simulation/models";
afterEach(() => vi.unstubAllEnvs());
describe("AI safeguards", () => {
  it("requires a key and exact model", () => {
    expect(() => config({})).toThrow("not configured");
  });
  it("refuses unverified and stale free eligibility", () => {
    const env = { GEMINI_API_KEY: "test", GEMINI_MODEL: "chosen", FREE_MODEL_ALLOWLIST: "chosen", FREE_MODEL_VERIFIED_ON: "2020-01-01", GEMINI_UNBILLED_PROJECT_CONFIRMED: "true" };
    expect(() => config(env)).toThrow("disabled");
    expect(() => config({ ...env, FREE_MODEL_VERIFIED_ON: new Date().toISOString().slice(0, 10), FREE_MODEL_ALLOWLIST: "other" })).toThrow("disabled");
  });
  it("accepts operator verification but never increases configured caps", () => {
    const env = { GEMINI_API_KEY: "test", GEMINI_MODEL: "chosen", FREE_MODEL_ALLOWLIST: "chosen", FREE_MODEL_VERIFIED_ON: new Date().toISOString().slice(0, 10), GEMINI_UNBILLED_PROJECT_CONFIRMED: "true" };
    expect(config(env).perRun).toBe(3);
    expect(() => config({ ...env, GEMINI_PER_RUN_LIMIT: "4" })).toThrow();
  });
  it("persists budget across callers and fails closed on corruption", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "timemachine-test-"));
    try {
      await reserveRequest(dir, 2); await reserveRequest(dir, 2);
      await expect(reserveRequest(dir, 2)).rejects.toThrow("budget");
      expect(JSON.parse(await readFile(path.join(dir, "quota.json"), "utf8")).count).toBe(2);
      await writeFile(path.join(dir, "quota.json"), "broken");
      await expect(reserveRequest(dir, 10)).rejects.toThrow("corrupt");
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
  it("prevents concurrent requests from bypassing daily cap", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "timemachine-test-"));
    try {
      const results = await Promise.allSettled(Array.from({ length: 8 }, () => reserveRequest(dir, 1)));
      expect(results.filter(r => r.status === "fulfilled")).toHaveLength(1);
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
  it("returns a transparent no-key error", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const response = await POST(new Request("http://localhost/api/scenarios/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Try", description: "What if?", values: defaults, consent: true }) }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("not configured");
  });
  it("accepts the actual same-origin Host when Next normalizes the URL hostname", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const response = await POST(new Request("http://localhost:3000/api/scenarios/generate", {
      method: "POST", headers: { "Content-Type": "application/json", host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" },
      body: JSON.stringify({ title: "Try", description: "What if?", values: defaults, consent: true }),
    }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("not configured");
  });
  it("rejects missing consent and cross-origin calls before model access", async () => {
    const response = await POST(new Request("http://localhost/api/scenarios/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Try", description: "What if?", values: defaults }) }));
    expect(response.status).toBe(400);
    const forbidden = await POST(new Request("http://localhost/api/scenarios/generate", { method: "POST", headers: { origin: "https://elsewhere.invalid" } }));
    expect(forbidden.status).toBe(403);
  });
  it("bounds incoming request size", async () => {
    const response = await POST(new Request("http://localhost/api/scenarios/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: "x".repeat(16001) }));
    expect(response.status).toBe(413);
  });
});
