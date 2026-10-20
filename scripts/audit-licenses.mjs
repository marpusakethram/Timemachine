import fs from "node:fs";
import path from "node:path";
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const rows = [];
for (const [location, record] of Object.entries(lock.packages)) {
  if (!location) continue;
  const packageFile = path.join(location, "package.json");
  if (!fs.existsSync(packageFile)) continue;
  const pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));
  const license = typeof pkg.license === "string" ? pkg.license : pkg.license?.type || "UNKNOWN";
  rows.push({ name: pkg.name, version: pkg.version, license, dev: !!record.dev });
}
rows.sort((a, b) => a.name.localeCompare(b.name));
const unknown = rows.filter(r => r.license === "UNKNOWN");
const content = `# Dependency license inventory

Generated from installed package manifests and the committed lockfile using
\`node scripts/audit-licenses.mjs\`. This inventory covers the local installation,
including development tools. Platform-specific optional packages may differ on other
machines and retain their upstream licenses. No third-party photos or videos are
bundled. The Schibsted Grotesk and IBM Plex Sans fonts are self-hosted through
Fontsource and use the SIL Open Font License 1.1. Lucide icons are ISC; the
shadcn-derived button pattern is MIT.

Our MIT license applies only to our own source and original diagram. Dependencies
remain under their listed licenses; retain their notices when redistributing.
Next.js brings optional Sharp/libvips binaries under Apache-2.0/LGPL terms.
This repository distributes our source, not those binaries; npm installs the
upstream packages with their notices. Binary redistributions must preserve
upstream LGPL obligations and corresponding-source availability.

Installed packages: ${rows.length}. Missing license declarations: ${unknown.length}.

| Package | Version | License | Scope |
|---|---|---|---|
${rows.map(r => `| ${r.name} | ${r.version} | ${r.license} | ${r.dev ? "development" : "runtime / transitive"} |`).join("\n")}
`;
fs.writeFileSync("docs/THIRD_PARTY_LICENSES.md", content);
console.log(`Audited ${rows.length} installed packages; ${unknown.length} missing license declarations.`);
if (unknown.length) process.exitCode = 1;
