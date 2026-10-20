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

This file is generated. Run \`node scripts/audit-licenses.mjs\` to rebuild it from the
installed packages and the committed lockfile. It covers everything installed locally,
dev tools included. Some optional packages are platform specific, so another machine
might show a slightly different list. Those keep their own upstream licenses.

What's bundled that isn't code: the Inter font, shipped through
\`@fontsource-variable/inter\` under the SIL Open Font License 1.1. No third-party
photos or videos. Lucide icons are ISC and the shadcn style button pattern is MIT.

Our MIT license only covers our own source and the original diagram. Every
dependency keeps its own license, so keep their notices if you redistribute.
Next.js pulls in optional Sharp/libvips binaries under Apache-2.0 and LGPL terms.
This repo ships our source, not those binaries. npm installs them with their own
notices. If you redistribute the binaries, you have to follow the LGPL rules,
including making the corresponding source available.

Installed packages: ${rows.length}. Missing license declarations: ${unknown.length}.

| Package | Version | License | Scope |
|---|---|---|---|
${rows.map(r => `| ${r.name} | ${r.version} | ${r.license} | ${r.dev ? "development" : "runtime / transitive"} |`).join("\n")}
`;
fs.writeFileSync("docs/THIRD_PARTY_LICENSES.md", content);
console.log(`Audited ${rows.length} installed packages; ${unknown.length} missing license declarations.`);
if (unknown.length) process.exitCode = 1;
