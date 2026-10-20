import fs from "node:fs";
const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
let body = "";
function text(x, y, value, size = 15, color = "#334155", extra = "") {
  body += `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${esc(value)}</text>`;
}
function box(x, y, w, h, color, title, lines, dashed = false) {
  body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="white" stroke="${color}" stroke-width="1.7" ${dashed ? 'stroke-dasharray="7 5"' : ""}/><rect x="${x+3}" y="${y+3}" width="${w-6}" height="${h-6}" rx="8" fill="url(#hatch)" opacity=".25"/>`;
  text(x + w / 2, y + 27, title, 16, color, 'text-anchor="middle" font-weight="600"');
  lines.forEach((line, i) => text(x + w / 2, y + 54 + i * 21, line, 12, "#526176", 'text-anchor="middle"'));
}
function arrow(x1, y1, x2, y2, color = "#64748b", dashed = false) {
  body += `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="1.6" marker-end="url(#arrow)" ${dashed ? 'stroke-dasharray="6 5"' : ""}/>`;
}
function lane(y, name, detail) { text(30, y, name, 14, "#3d4858", 'letter-spacing="1"'); text(30, y + 22, detail, 11, "#7c8798"); }
text(48, 52, "TIME MACHINE", 26, "#20334d", 'font-weight="700" letter-spacing="2"');
text(48, 80, "A local-first startup decision lab · conditional models, not forecasts", 15);
text(1150, 52, "ARCHITECTURE / v1", 12, "#64748b", 'text-anchor="end"');
lane(158, "INPUTS", "Explicit user actions");
box(220, 115, 260, 105, "#3b82f6", "Startup dilemma", ["Title + description + baseline", "Cash · revenue · costs · currency"]);
box(510, 115, 255, 105, "#22a06b", "Local SaaS demo", ["50k cash · 4k MRR · 24 months", "Three fictional strategic paths"]);
box(795, 115, 330, 105, "#e29334", "JSON import / hash share", ["Versioned, portable scenario", "Warning before sharing full inputs"]);
lane(304, "VALIDATION", "Zod trust boundary");
box(290, 270, 740, 110, "#e29334", "Decision + Baseline + exactly 3 Branches", ["UUIDs · bounded numeric values · schema_version · engine_version", "Units, ranges, provenance and last-edited timestamps · reject corrupt imports"]);
arrow(350, 220, 470, 270, "#3b82f6"); arrow(637, 220, 637, 270, "#22a06b"); arrow(960, 220, 850, 270, "#e29334");
lane(451, "SCENARIO DESIGN", "Optional model call");
box(220, 425, 395, 145, "#8b5cf6", "Gemini server route", ["Official @google/genai SDK · key stays server-side", "Verified free-model allowlist · unbilled project", "Daily / per-run budgets · bounded retries", "20s timeout · output cap · SHA-256 cache"], true);
box(685, 425, 440, 145, "#22a06b", "Review candidate assumptions", ["3 distinct pathways · 3–5 adjustable inputs each", "Inferred labels · explanations · risks · experiments", "Explicit review before applying candidates", "User-edited numbers preserved on regeneration"]);
arrow(500, 380, 415, 425, "#8b5cf6", true); arrow(615, 495, 685, 495, "#8b5cf6");
body += '<path d="M1030 325 L1150 325 L1150 605 L905 605 L905 620" fill="none" stroke="#22a06b" stroke-width="1.6" stroke-dasharray="6 5" marker-end="url(#arrow)"/>';
text(1140, 400, "No-key path", 11, "#22a06b", 'text-anchor="end"');
arrow(905, 570, 905, 620, "#22a06b");
lane(662, "SIMULATION", "Pure TypeScript");
box(220, 620, 905, 174, "#3b82f6", "Deterministic financial engine · 24 monthly snapshots", ["Revenue = prior revenue × (1 + growth) × (1 − churn)", "Gross profit − operating expenses = operating cash flow", "Ending cash = beginning cash + operating CF + financing − one-time capex", "Hiring step changes · first cash shortfall · minimum cash · funding gap", "Priced-round dilution only when valuation is known · input fingerprint + timestamp"], true);
lane(874, "EXPLORATION", "Immediate recomputation");
box(220, 845, 270, 115, "#3b82f6", "Branch graph", ["React Flow · keyboard branch buttons", "Bootstrap / Hire / Raise"]);
box(525, 845, 285, 115, "#8b5cf6", "Charts + comparison", ["Recharts cash curves · ownership", "Sort by runway or ending cash"]);
box(845, 845, 280, 115, "#22a06b", "Sensitivity lab", ["Growth sweep + expense grid", "Fixed units · no certainty scores"]);
arrow(350, 794, 350, 845, "#3b82f6"); arrow(665, 794, 665, 845, "#8b5cf6"); arrow(985, 794, 985, 845, "#22a06b");
lane(1042, "PERSISTENCE", "Local by default");
box(220, 1010, 435, 115, "#64748b", "Browser localStorage", ["Create · save · edit · reload · reset", "50 scenario limit · explicit deletion · no accounts"]);
box(690, 1010, 435, 115, "#e29334", "Portable outputs", ["Validated JSON · 24-row CSV · client PNG", "Small hash links · export file for larger scenarios"]);
arrow(350, 960, 435, 1010); arrow(985, 960, 910, 1010, "#e29334");
box(220, 1170, 905, 105, "#64748b", "Next.js + TypeScript + Tailwind + shadcn-style UI", ["One local Node process · no database service · no bank connections · no paid failover", "Vitest engine / boundary tests + Playwright user flows + production build"]);
arrow(435, 1125, 435, 1170); arrow(910, 1125, 910, 1170);
text(600, 1320, "MODEL THE TRADE-OFF · every number is an assumption · no fetched market data", 14, "#526176", 'text-anchor="middle"');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1360" viewBox="0 0 1200 1360" role="img" aria-labelledby="title desc"><title id="title">Time Machine architecture</title><desc id="desc">Inputs pass Zod validation into a pure 24-month financial engine. Optional Gemini candidates require consent and review. React Flow and Recharts display results. Saves use browser localStorage and exports are portable.</desc><defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1 1 L1 -1 M0 7 L7 0 M6 8 L8 6" stroke="#a9bacd" stroke-width=".55"/></pattern><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L6 3.5 L0 7" fill="none" stroke="#64748b" stroke-width="1.2"/></marker></defs><rect width="1200" height="1360" fill="#fff"/><g font-family="'Segoe Print','Comic Sans MS','Segoe UI',sans-serif">${body}</g></svg>`;
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/architecture.svg", svg);
