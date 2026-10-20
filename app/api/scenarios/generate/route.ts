import { z } from "zod";
import { AIError, generate } from "@/lib/ai/gemini";
import { Values } from "@/lib/simulation/models";
export const runtime = "nodejs";
const Request = z.object({
  title: z.string().trim().min(1).max(120), description: z.string().trim().min(1).max(1500),
  values: Values, consent: z.literal(true),
});
export async function POST(request: globalThis.Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    // Next may normalize request.url to localhost; Host retains the browser's address.
    try {
      const caller = new URL(origin);
      if (!["http:", "https:"].includes(caller.protocol) || caller.host !== (request.headers.get("host") || new URL(request.url).host)) {
        return Response.json({ error: "Cross-origin generation is not allowed." }, { status: 403 });
      }
    } catch { return Response.json({ error: "Invalid request origin." }, { status: 403 }); }
  }
  try {
    if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "JSON required." }, { status: 415 });
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "Empty request." }, { status: 400 });
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 16000) { await reader.cancel(); return Response.json({ error: "Request too large." }, { status: 413 }); }
      chunks.push(value);
    }
    const body = Request.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    // Consent is enforced here as well as in the client.
    const { consent: _, ...input } = body;
    return Response.json(await generate(input), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof AIError) return Response.json({ error: e.message }, { status: e.status });
    if (e instanceof z.ZodError || e instanceof SyntaxError) return Response.json({ error: "Invalid scenario. Check title, description, numbers and consent." }, { status: 400 });
    return Response.json({ error: "Local generation service failed. Check server storage permissions; offline simulation still works." }, { status: 500 });
  }
}
