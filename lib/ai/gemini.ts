import { GoogleGenAI } from "@google/genai";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rmdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { Candidate, parseCandidate } from "./schema";
import { fields, Values } from "../simulation/models";

export class AIError extends Error {
  constructor(message: string, public status = 503) { super(message); }
}
export function config(env: Record<string, string | undefined> = process.env) {
  const model = env.GEMINI_MODEL?.trim();
  if (!env.GEMINI_API_KEY || !model) throw new AIError("Gemini is not configured. Use the local template; no key is needed.");
  const verified = Date.parse(env.FREE_MODEL_VERIFIED_ON || "");
  const age = Date.now() - verified;
  if (!env.FREE_MODEL_ALLOWLIST?.split(",").map(s => s.trim()).includes(model) ||
    !Number.isFinite(age) || age < -86400000 || age > 30 * 86400000 ||
    env.GEMINI_UNBILLED_PROJECT_CONFIRMED !== "true") {
    throw new AIError("API calls are disabled. Verify this exact model on Google's pricing page within 30 days and confirm a project with billing disabled.");
  }
  const bounded = (name: string, fallback: number, max: number) => {
    const n = Number(env[name] || fallback);
    if (!Number.isInteger(n) || n < 1 || n > max) throw new AIError(`Invalid ${name}; expected 1 to ${max}.`);
    return n;
  };
  return {
    key: env.GEMINI_API_KEY, model, daily: bounded("GEMINI_DAILY_REQUEST_LIMIT", 10, 100),
    perRun: bounded("GEMINI_PER_RUN_LIMIT", 3, 3),
    output: bounded("GEMINI_MAX_OUTPUT_TOKENS", 3000, 4096),
    // Runtime state is not a build asset and must never be bundled for deployment.
    dir: path.resolve(/* turbopackIgnore: true */ env.TIMEMACHINE_DATA_DIR || ".data"),
  };
}
async function atomicWrite(file: string, value: unknown) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(value), { mode: 0o600 });
  await rename(temporary, file);
}
// Disk lock coordinates multiple local server processes; fail closed on contention.
export async function reserveRequest(dir: string, limit: number) {
  await mkdir(dir, { recursive: true });
  const lock = path.join(dir, "quota.lock");
  try { await mkdir(lock); } catch { throw new AIError("Quota ledger is busy or locked. Try again; see README for crash recovery.", 429); }
  try {
    const file = path.join(dir, "quota.json");
    let ledger = { day: new Date().toISOString().slice(0, 10), count: 0 };
    try {
      const previous = z.object({ day: z.string(), count: z.number().int().nonnegative() }).parse(JSON.parse(await readFile(file, "utf8")));
      if (previous.day === ledger.day) ledger = previous;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw new AIError("Quota ledger is corrupt. API calls stopped; inspect the local data directory.");
    }
    if (ledger.count >= limit) throw new AIError("Local daily request budget reached. The local template and simulator still work.", 429);
    ledger.count++;
    await atomicWrite(file, ledger);
  } finally { await rmdir(lock); }
}
const system = "You are a skeptical startup scenario designer. Return three mutually distinct strategic pathways; do not forecast probabilities, invent citations or assert economic data without sources. All numbers are inferred candidate assumptions, not predictions. Return 3–5 adjustable assumptions per branch with explanations, risks, disconfirming signals and experiment next steps. No external tools. Use only the supplied field names and numeric ranges. Explain extreme values explicitly.";
export async function generate(input: { title: string; description: string; values: Values }) {
  const c = config();
  const contents = JSON.stringify({ ...input, ranges: fields });
  // UTF-8 bytes conservatively bound input tokens without a second model request.
  if (Buffer.byteLength(contents, "utf8") > 16000) throw new AIError("Input exceeds the local input size cap.", 400);
  const key = createHash("sha256").update(JSON.stringify({ version: 1, model: c.model, contents })).digest("hex");
  const cache = path.join(c.dir, "cache", `${key}.json`);
  try {
    const candidate = parseCandidate(JSON.parse(await readFile(cache, "utf8")));
    return { candidate, model: c.model, cached: true };
  } catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") { /* Invalid cache is discarded and regenerated. */ } }
  const client = new GoogleGenAI({ apiKey: c.key });
  let corrected = false;
  for (let attempt = 0; attempt < c.perRun; attempt++) {
    await reserveRequest(c.dir, c.daily);
    try {
      const response = await client.models.generateContent({
        model: c.model, contents: contents + (corrected ? "\nPrevious output failed validation. Follow the JSON schema exactly; include distinct branches and detailed explanations." : ""),
        config: {
          systemInstruction: system, temperature: 0, maxOutputTokens: c.output,
          responseMimeType: "application/json", responseJsonSchema: z.toJSONSchema(Candidate),
          httpOptions: { timeout: 20000, retryOptions: { attempts: 1 } },
        },
      });
      let candidate: Candidate;
      try { candidate = parseCandidate(JSON.parse(response.text || "")); }
      catch {
        if (!corrected && attempt + 1 < c.perRun) { corrected = true; continue; }
        throw new AIError("Gemini returned invalid candidate assumptions. No values were applied; use the local template.", 502);
      }
      await mkdir(path.dirname(cache), { recursive: true });
      await atomicWrite(cache, candidate);
      console.info("timemachine.generation", { model: c.model, cached: false, attempt: attempt + 1 });
      return { candidate, model: c.model, cached: false };
    } catch (e) {
      if (e instanceof AIError) throw e;
      const status = Number((e as { status?: number }).status);
      if ((status === 429 || status >= 500) && attempt + 1 < c.perRun) {
        await new Promise(resolve => setTimeout(resolve, 750 * 2 ** attempt));
        continue;
      }
      throw new AIError(status === 429 ? "Gemini quota reached. No values changed. Use the local template or retry later." : "Gemini request failed or timed out. No values changed. The local simulator remains available.", status === 429 ? 429 : 502);
    }
  }
  throw new AIError("Per-run request budget reached. Use the local template.", 429);
}
