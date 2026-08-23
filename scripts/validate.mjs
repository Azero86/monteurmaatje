import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const failures = [];
const warnings = [];
const ok = message => console.log(`✓ ${message}`);
const fail = message => failures.push(message);
const warn = message => warnings.push(message);
const exists = rel => fs.existsSync(path.join(ROOT, rel));
const readJson = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const allFiles = walk(ROOT)
  .filter(file => !file.includes(`${path.sep}.git${path.sep}`))
  .map(file => path.relative(ROOT, file).replaceAll(path.sep, "/"));

const jsonFiles = allFiles.filter(file => file.endsWith(".json"));
for (const file of jsonFiles) {
  try { readJson(file); }
  catch (error) { fail(`${file}: ongeldige JSON (${error.message})`); }
}
if (!failures.length) ok(`${jsonFiles.length} JSON-bestanden syntactisch geldig`);

for (const file of ["app.js", "sw.js"]) {
  try { execFileSync(process.execPath, ["--check", file], { cwd: ROOT, stdio: "pipe" }); }
  catch (error) { fail(`${file}: JavaScript syntaxfout`); }
}
ok("JavaScript syntaxcontrole uitgevoerd");

const catalog = readJson("data/catalog.json");
const brandIds = new Set();
const deviceIds = new Set();
const referencedData = new Set();

for (const brand of catalog.brands || []) {
  if (!brand?.id) fail("Catalogus bevat merk zonder id");
  if (brandIds.has(brand.id)) fail(`Dubbel merk-id: ${brand.id}`);
  brandIds.add(brand.id);

  const localDeviceIds = new Set();
  for (const device of brand.devices || []) {
    if (!device?.id) fail(`${brand.id}: toestel zonder id`);
    if (localDeviceIds.has(device.id)) fail(`${brand.id}: dubbel toestel-id ${device.id}`);
    localDeviceIds.add(device.id);
    deviceIds.add(device.id);

    for (const key of ["faultsPath", "parametersPath", "combustionPath", "diagnosticsPath"]) {
      const rel = device[key];
      if (!rel) continue;
      referencedData.add(rel);
      if (!exists(rel)) {
        fail(`${device.id}: ${key} ontbreekt (${rel})`);
        continue;
      }
      try {
        const payload = readJson(rel);
        const dirId = path.basename(path.dirname(rel));
        const accepted = new Set([dirId, `${brand.id}-${dirId}`]);
        if (payload.deviceId && !accepted.has(payload.deviceId)) {
          fail(`${rel}: deviceId "${payload.deviceId}" past niet bij ${brand.id}/${dirId}`);
        }

        const collection =
          rel.endsWith("/faults.json") ? payload.faults :
          rel.endsWith("/parameters.json") ? payload.parameters :
          rel.endsWith("/diagnostics.json") ? payload.diagnostics : null;

        if (Array.isArray(collection)) {
          const keyName = rel.endsWith("/diagnostics.json") ? "id" : "code";
          const seen = new Map();
          for (const item of collection) {
            const code = String(item?.[keyName] ?? "").trim();
            if (!code) continue;
            seen.set(code, (seen.get(code) || 0) + 1);
          }
          for (const [code, count] of seen) {
            if (count > 1) warn(`${rel}: ${count}× ${keyName} "${code}" — handmatig beoordelen of duplicaat bewust is`);
          }
        }
      } catch (error) {
        fail(`${rel}: kon inhoud niet valideren (${error.message})`);
      }
    }
  }
}
ok(`${brandIds.size} merken en cataloguspaden gecontroleerd`);

const sw = fs.readFileSync("sw.js", "utf8");
const shellMatch = sw.match(/const CORE_SHELL = \[([\s\S]*?)\];/);
if (!shellMatch) {
  fail("sw.js: CORE_SHELL niet gevonden");
} else {
  const refs = [...shellMatch[1].matchAll(/appUrl\("([^"]+)"\)/g)].map(match => match[1].split("?")[0]);
  for (const rel of refs) if (!exists(rel)) fail(`Serviceworker verwijst naar ontbrekend bestand: ${rel}`);
  for (const required of ["knowledge/heating-power.json", "tools/elga-ace.json", "tools/xtend-eco.json"]) {
    if (!refs.includes(required)) fail(`Offline toolbestand ontbreekt in CORE_SHELL: ${required}`);
  }
  ok(`${refs.length} serviceworker shell-assets gecontroleerd`);
}

const html = fs.readFileSync("index.html", "utf8");
for (const match of html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:\?[^"]*)?"/g)) {
  const rel = match[1];
  if (/^https?:/.test(rel)) continue;
  if (!exists(rel)) fail(`index.html verwijst naar ontbrekend lokaal bestand: ${rel}`);
}
for (const id of ["diagramViewer", "diagramViewerFit", "diagramViewerClose", "diagramViewerStage", "diagramViewerImage"]) {
  if (!html.includes(`id="${id}"`)) fail(`Viewer-element ontbreekt: #${id}`);
}
ok("index.html lokale verwijzingen en viewer-elementen gecontroleerd");

const mdInRuntime = allFiles.filter(file => file.endsWith(".md") && !file.startsWith(".github/"));
if (mdInRuntime.length) warn(`Niet-runtime .md-bestanden aanwezig: ${mdInRuntime.join(", ")}`);

if (warnings.length) {
  console.log("\nWaarschuwingen:");
  for (const message of warnings) console.log(`! ${message}`);
}

if (failures.length) {
  console.error("\nVALIDATIE MISLUKT:");
  for (const message of failures) console.error(`✗ ${message}`);
  process.exit(1);
}

console.log("\nMonteurMaatje integriteitscontrole: OK");
