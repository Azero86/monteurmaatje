#!/usr/bin/env python3
from pathlib import Path
from collections import Counter
import json, re, subprocess, sys, zipfile

ROOT = Path(__file__).resolve().parents[1]
errors, warnings = [], []
stats = {}

def fail(msg): errors.append(msg)
def warn(msg): warnings.append(msg)

# JSON
json_files=list(ROOT.rglob("*.json"))
stats["json_files"]=len(json_files)
for p in json_files:
    try: json.loads(p.read_text(encoding="utf-8"))
    except Exception as e: fail(f"JSON ongeldig: {p.relative_to(ROOT)} -> {e}")

# Catalogus / paden / deviceId
catalog_path=ROOT/"data/catalog.json"
if not catalog_path.exists():
    fail("data/catalog.json ontbreekt")
    catalog={"brands":[]}
else:
    catalog=json.loads(catalog_path.read_text(encoding="utf-8"))

devices=0; faults=0; parameters=0; combustion=0; diagnostics=0
expected_search=set()
for brand in catalog.get("brands",[]):
    for device in brand.get("devices",[]):
        devices += 1
        did=device.get("id","")
        expected_search.add(("device",brand.get("id",""),did,""))
        for key, array_key, kind in [
            ("faultsPath","faults","fault"),("parametersPath","parameters","parameter"),
            ("combustionPath",None,"combustion"),("diagnosticsPath","diagnostics","diagnostic")
        ]:
            rel=device.get(key)
            if not rel: continue
            p=ROOT/rel
            if not p.exists():
                fail(f"Cataloguspad ontbreekt: {rel}")
                continue
            try: data=json.loads(p.read_text(encoding="utf-8"))
            except Exception: continue
            if data.get("deviceId") and data.get("deviceId") not in {did, f'{brand.get("id","")}-{did}'}:
                fail(f"deviceId mismatch: {rel} -> {data.get('deviceId')} / catalogus {did}")
            if array_key:
                arr=data.get(array_key)
                if not isinstance(arr,list):
                    fail(f"{rel}: veld '{array_key}' ontbreekt of is geen lijst")
                    continue
                if kind=="fault":
                    faults += len(arr)
                    for x in arr:
                        code=str(x.get("code","")).strip()
                        if not code: fail(f"Lege storingscode in {rel}")
                        expected_search.add(("fault",brand.get("id",""),did,code))
                elif kind=="parameter":
                    parameters += len(arr)
                    for x in arr:
                        code=str(x.get("code","")).strip()
                        if not code: fail(f"Lege parametercode in {rel}")
                        expected_search.add(("parameter",brand.get("id",""),did,code))
                else: diagnostics += len(arr)
            else:
                combustion += 1

stats.update(devices=devices,faults=faults,parameters=parameters,combustion_files=combustion,diagnostics=diagnostics)

# Zoekindex
sip=ROOT/"search-index.json"
if not sip.exists():
    fail("search-index.json ontbreekt")
else:
    si=json.loads(sip.read_text(encoding="utf-8"))
    entries=si.get("entries",[])
    stats["search_entries"]=len(entries)
    if si.get("entryCount") != len(entries): fail("search-index entryCount klopt niet")
    actual=set()
    for e in entries:
        if e.get("kind") in {"device","fault","parameter"}:
            actual.add((e.get("kind",""),e.get("brandId",""),e.get("deviceId",""),str(e.get("code","")).strip()))
    missing=expected_search-actual
    if missing: fail(f"Zoekindex mist {len(missing)} toestel/storing/parameter-record(s)")

# HTML dubbele IDs + OG
html=(ROOT/"index.html").read_text(encoding="utf-8")
ids=re.findall(r'\bid=["\']([^"\']+)["\']',html)
dups=[x for x,n in Counter(ids).items() if n>1]
if dups: fail("Dubbele HTML-id's: "+", ".join(dups))
for tag in ['og:title','og:description','og:image','og:url']:
    if f'property="{tag}"' not in html: fail(f"Open Graph {tag} ontbreekt")
if not (ROOT/"assets/social/monteurmaatje-share.png").exists(): fail("Social preview-afbeelding ontbreekt")

# Mitsubishi iconen / layout
for emoji in ["🔧 Instellen / inbedrijfstellen","🔎 Klacht oplossen","🎚 DIP-switches","🖥 Servicemenu"]:
    if emoji in html: fail(f"Oude Mitsubishi emoji nog aanwezig: {emoji}")
if not (ROOT/"assets/mitsubishi/ftc6-dipswitch-layout.png").exists(): fail("FTC6 DIP-layout ontbreekt")

# JS syntax
for name in ["app.js","sw.js"]:
    p=ROOT/name
    cp=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    if cp.returncode: fail(f"{name} syntaxfout: {cp.stderr.strip()}")

# PWA core-shell verwijzingen
sw=(ROOT/"sw.js").read_text(encoding="utf-8")
for ref in re.findall(r'appUrl\("([^"]+)"\)',sw):
    clean=ref.split("?",1)[0]
    if not (ROOT/clean).exists(): fail(f"Serviceworker verwijst naar ontbrekend bestand: {clean}")

manifest=json.loads((ROOT/"manifest-v3.webmanifest").read_text(encoding="utf-8"))
for icon in manifest.get("icons",[]):
    p=ROOT/icon["src"].replace("./","",1)
    if not p.exists(): fail(f"Manifest-icoon ontbreekt: {p.relative_to(ROOT)}")

# Release/version metadata
version=json.loads((ROOT/"version.json").read_text(encoding="utf-8"))
release=json.loads((ROOT/"release.json").read_text(encoding="utf-8"))
if "phase 4" in release.get("change","").lower(): fail("release.json bevat nog verouderde Mitsubishi phase 4 metadata")
if version.get("version") not in release.get("change","") and version.get("version") != "1.0.1":
    warn("Zichtbare versie komt niet expliciet terug in releasebeschrijving")

# Rapport
print("MONTEURMAATJE RELEASECHECK")
print("="*31)
for k,v in stats.items(): print(f"{k}: {v}")
print(f"waarschuwingen: {len(warnings)}")
for x in warnings: print("  !",x)
print(f"fouten: {len(errors)}")
for x in errors: print("  X",x)
if errors:
    print("\nRESULTAAT: RELEASE GEBLOKKEERD")
    sys.exit(1)
print("\nRESULTAAT: RELEASE GOEDGEKEURD")
